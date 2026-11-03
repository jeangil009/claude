"""Score, foley, ambience and voice -> out/mix.wav (stereo, 48 kHz). Reads events.json (exported from the page) and tts/out/*.wav."""
import sys, os, json
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB', '/root/lemo-opuscar')
sys.path.insert(0, LIB)
import numpy as np, soundfile as sf, soxr
from scipy.signal import sosfilt, butter
from core.audio import sampler as S, pluck as P
from core.audio.sfx import SR, add, limit, compress, bp, lp, hp, noise, norm, t_, thump, whoosh, click, clack, ding

S.seed(7)
rng = np.random.default_rng(11)
D = json.load(open(os.path.join(HERE, 'events.json')))
EV, DUR = D['ev'], D['dur']
N = int(DUR * SR) + SR
BEAT = 60 / 72; BAR = BEAT * 4
bar = lambda n, b=0: (n - 1) * BAR + b * BEAT          # bar n (1-based), beat b (0-based)

def stereo(): return np.zeros((N, 2), np.float32)
def env_seg(x, a=.05, r=.1):
    n = len(x); e = np.ones(n, np.float32); na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return x * e
def sweep_pan(mono, p0, p1):
    n = len(mono); p = np.linspace(p0, p1, n); th = (p + 1) * np.pi / 4
    return np.stack([mono * np.cos(th), mono * np.sin(th)], 1).astype(np.float32)
def put(buf, x2, at):                                  # add a stereo array
    i = int(at * SR); n = min(len(x2), len(buf) - i)
    if n > 0 and i >= 0: buf[i:i + n] += x2[:n]

# ---------------- music ----------------
CH = {1: ('D', ['D3', 'A3', 'F#4', 'A4']), 2: ('A', ['A2', 'E3', 'C#4', 'E4']), 3: ('Bm', ['B2', 'F#3', 'D4', 'F#4']), 4: ('G', ['G2', 'D3', 'B3', 'D4'])}
PROG = {1: 1, 2: 2, 3: 3, 4: 4, 5: 1, 6: 2, 7: 3, 8: 4, 9: 1, 10: 2, 12: 3, 13: 4, 14: 4, 15: 1}
ev_s = []        # (t, inst, pitch, dur, vel, pan, gain)
def chord(n): return CH[PROG[n]][1]
# pads: bowed vibraphone under the long sections
for n in [1, 2, 6, 7, 8, 9, 10, 13, 14, 15]:
    ch = chord(n)
    dur = BAR * (2 if n == 1 else 1) if n != 15 else BAR * 1.0 + 2.6
    if n == 2: continue
    for p, v in zip([ch[1], ch[2], ch[3]], [.22, .2, .16]):
        ev_s.append((bar(n), 'vibraphone_bowed', p, dur + .3, v * (1.3 if n == 15 else 1), -.2 if p == ch[1] else .2, .9))
ev_s += [(bar(2), 'vibraphone_bowed', 'E3', BAR + .3, .2, -.2, .9), (bar(2), 'vibraphone_bowed', 'A3', BAR + .3, .2, .2, .9)]
# glockenspiel: sparse, echoing the flag, the lamp and the windows
for t, p, v in [(.6, 'A5', .35), (2.1, 'D6', .4), (bar(2, 1), 'F#6', .42), (3.333, 'A6', .5), (bar(2, 3), 'E6', .3),
                (bar(14), 'A6', .5), (T_LAMP := 43.33, 'F#6', .5), (44.17, 'A6', .55), (bar(14, 3), 'D7', .45), (bar(15), 'F#6', .5), (bar(15, 2), 'A6', .45), (bar(15, 3), 'D7', .4)]:
    ev_s.append((t, 'glockenspiel', p, 3.0, v, .3 if t % 2 < 1 else -.3, 1.0))
# arpeggio patterns (eighth notes)
def arp(n, t0, step, idxs, inst, vel, pan=0., gain=1., oct_up=0):
    ch = chord(n)
    for k, ix in enumerate(idxs):
        p = S.name(S.midi(ch[ix % 4]) + 12 * oct_up) if hasattr(S, 'name') else ch[ix % 4]
        ev_s.append((t0 + k * step, inst, p, step * 2.2, vel * (1 if k % 4 else 1.15), pan, gain))
E8 = BEAT / 2
for n in [3, 4, 5]:                                  # kalimba + guitar (sections 3-5), pulsed
    arp(n, bar(n), E8, [0, 1, 2, 1, 3, 2, 1, 2], 'KAL', .55, .25)
    arp(n, bar(n), BEAT, [0, 2, 1, 3], 'GTR', .6, -.25, oct_up=0)
for n in [6, 7, 8]:                                  # harp joins, piano quarters
    arp(n, bar(n), E8, [0, 1, 2, 3, 2, 1, 2, 1], 'harp', .5, .3)
    for k, ix in enumerate([0, 1, 2, 1]): ev_s.append((bar(n, k), 'piano', chord(n)[ix], BEAT * 1.6, .34, -.1, 1.0))
    arp(n, bar(n), BEAT, [0, 2, 1, 3], 'GTR', .55, -.3)
for n in [9, 10]:                                    # acceleration: sixteenths, everyone
    arp(n, bar(n), E8 / 2, [0, 1, 2, 3, 2, 1, 2, 3, 0, 1, 2, 3, 2, 1, 2, 3], 'harp', .5, .3)
    arp(n, bar(n), E8, [0, 2, 1, 3, 0, 2, 1, 3], 'KAL', .6, -.3)
    for k in range(4): ev_s.append((bar(n, k), 'piano', chord(n)[0], BEAT * 1.4, .42, 0, 1.0))
# bar 11: silence. bars 12-13: felt piano alone, one note at a time
MEL = [(bar(12), 'D4', 2.4, .5), (bar(12, 3), 'F#4', 1.2, .42), (bar(13), 'A4', 1.6, .45), (bar(13, 2), 'G4', 1.2, .4), (bar(13, 3), 'F#4', 1.4, .42)]
for t, p, d, v in MEL: ev_s.append((t, 'piano', p, d, v, 0, 1.0))
for k, p in enumerate(['B2', 'F#3', 'D4']): ev_s.append((bar(12) + k * .0, 'piano', p, 3.0, .26, -.1, 1.0))
for k, p in enumerate(['G2', 'D3', 'B3']): ev_s.append((bar(13), 'piano', p, 3.0, .26, -.1, 1.0))
# bars 14-15: everything returns and settles on D
arp(14, bar(14), E8, [0, 1, 2, 3, 2, 1, 2, 1], 'harp', .5, .3)
for k in range(4): ev_s.append((bar(14, k), 'piano', chord(14)[[0, 1, 2, 1][k]], BEAT * 1.6, .4, -.1, 1.0))
arp(15, bar(15), BEAT, [0, 1, 2, 3], 'harp', .45, .3)
for p, v in [('D3', .5), ('A3', .42), ('D4', .45), ('F#4', .4)]: ev_s.append((bar(15), 'piano', p, 3.0, v, 0, 1.0))
ev_s.append((bar(15, 2), 'piano', 'A4', 2.0, .38, .1, 1.0))

def render_music():
    sampled = [e for e in ev_s if e[1] not in ('KAL', 'GTR')]
    out = S.render([e[:6] + ((e[6],) if len(e) > 6 else ()) for e in sampled], dur=DUR + 4, master=False)
    out = np.asarray(out, np.float32)
    buf = stereo(); n = min(len(out), len(buf)); buf[:n] += out[:n]
    for t, inst, p, d, v, pan, g in [e for e in ev_s if e[1] in ('KAL', 'GTR')]:
        x = P.pluck('kalimba' if inst == 'KAL' else 'nylon_guitar', p if inst == 'GTR' else S.name(S.midi(p) + 12), d, vel=v)
        add(buf, x * g, t, g * .9, pan)
    return buf

# ---------------- sfx ----------------
def rustle(d, gain=.6, pan=0.):
    n = int(d * SR); base = bp(noise(d), 1400, 6000, 2)
    m = lp(np.abs(noise(d)), 14, 2); m = m / (m.max() + 1e-9); trem = .55 + .45 * np.sin(2 * np.pi * 9 * t_(d) + rng.uniform(0, 6))
    x = env_seg(base * (.25 + m) * trem, min(.2, d / 4), min(.25, d / 3))
    return sweep_pan(norm(x, .5) * gain, pan - .3, pan + .3)
def mist(d, gain=.6, soft=0):
    x = bp(noise(d), 300 if not soft else 400, 2200, 2) + .5 * lp(noise(d), 180, 2)
    e = np.sin(np.pi * np.linspace(0, 1, len(x))) ** 1.5; return sweep_pan(norm(x * e, .6) * gain, -.4, .4)
def slide(d, gain=.6, pan=0.):
    x = bp(noise(d), 700, 5000, 2) * (np.sin(np.pi * np.linspace(0, 1, int(d * SR))) ** 2); return sweep_pan(norm(x, .5) * gain, pan - .5, pan + .5)
def plink(f=1500, d=.4, v=.4):
    tt = t_(d); return v * np.sin(2 * np.pi * f * tt * (1 + .05 * np.exp(-tt * 30))) * np.exp(-tt * 14)
def tone(f, d, v=.3, dec=6): tt = t_(d); return v * (np.sin(2 * np.pi * f * tt) + .3 * np.sin(2 * np.pi * 2.01 * f * tt)) * np.exp(-tt * dec)

sfx = stereo()
for e in EV:
    t, k = e['t'], e['type']
    if k == 'rustle': put(sfx, rustle(max(.3, e['dur']), e.get('gain', .6), e.get('pan', 0)) * .5, t)
    elif k == 'mist': put(sfx, mist(e['dur'], .55, e.get('soft', 0)), t)
    elif k == 'slide': put(sfx, slide(e['dur'], .55, e.get('pan', 0)), t)
    elif k == 'flag':
        add(sfx, thump(.8, 90), t, .7, .4)
        for i in range(3): add(sfx, bp(noise(.18), 800, 3200) * np.hanning(int(.18 * SR)), t + .05 + i * .16, .45, .4)
    elif k == 'dig':
        for i in range(5): add(sfx, thump(.55, 52 + 6 * i), t + i * .34, .55, -.2); add(sfx, bp(noise(.3), 250, 1600) * np.exp(-t_(.3) * 9), t + i * .34 + .03, .5, -.2)
    elif k == 'pour':
        x = bp(noise(e['dur']), 400, 3200) * (.5 + .5 * lp(np.abs(noise(e['dur'])), 20)); add(sfx, env_seg(norm(x, .5), .2, .4), t, .5, 0)
        for i in range(10): add(sfx, plink(rng.uniform(500, 1100), .15, .25), t + rng.uniform(0, e['dur']), .4, rng.uniform(-.4, .4))
    elif k == 'slab': add(sfx, thump(.9, 62), t, .75, 0); add(sfx, clack(.8, .6), t + .01, .45, 0)
    elif k == 'net':
        kind = e['kind']
        if kind == 'water':
            for i in range(4): add(sfx, plink(rng.uniform(1100, 1800), .35, .5), t + .15 + i * .22, .55, -.3)
        elif kind == 'power':
            for i in range(3): add(sfx, bp(noise(.14), 800, 3200) * np.exp(-t_(.14) * 25) + .4 * tone(110 * (i + 1), .14, .3, 20), t + .1 + i * .25, .45, .3)
        elif kind == 'oxy': add(sfx, env_seg(hp(noise(.8), 3000, 2) * .4, .15, .4), t, .45, -.2)
        else: add(sfx, whoosh(.7, .5), t, .45, .2)
    elif k == 'light':
        add(sfx, click(1.1, .3), t, .35, rng.uniform(-.4, .4)); add(sfx, tone(1318, 1.2, .16, 3.5), t, .3, rng.uniform(-.3, .3))
        if e.get('big'): add(sfx, tone(659, 1.8, .22, 2.4), t, .4, .2)
    elif k == 'drop': add(sfx, plink(1250, .6, .5), t, .8, 0); add(sfx, thump(.3, 140), t, .4, 0)
    elif k == 'lift': put(sfx, rustle(.5, .4, 0) * .6, t - .1)

# ---------------- ambience ----------------
amb = stereo()
def bed(t0, t1, mono, fade=1.0, gain=1.0):
    n = int((t1 - t0) * SR); x = mono[:n].copy()
    f = int(fade * SR); x[:f] *= np.linspace(0, 1, f); x[-f:] *= np.linspace(1, 0, f)
    i = int(t0 * SR); amb[i:i + n, 0] += x * gain; amb[i:i + n, 1] += x * gain * .96
def wind(d): return norm(lp(noise(d), 700, 2) * (.6 + .4 * lp(np.abs(noise(d)), .6, 1) / 0.4), .5)
def chirp(f0, d=.12): tt = t_(d); return .5 * np.sin(2 * np.pi * (f0 * tt + 700 * tt ** 2)) * np.hanning(len(tt))
bed(0, 9.6, wind(9.6), 1.2, .22)
for t in [1.7, 2.6, 3.0, 5.2, 6.1, 6.4, 7.7]:
    add(amb, chirp(rng.uniform(3000, 4200)), t, .22, rng.uniform(-.6, .6))
bed(8.4, 19.4, norm(lp(noise(11), 220, 2), .5), 1.6, .26)
for t in np.arange(12.2, 19, 1.4): add(amb, bp(noise(.2), 300, 1500) * np.exp(-t_(.2) * 12), t, .18, rng.uniform(-.5, .5))
bed(19, 33.0, norm(lp(noise(14), 320, 2) + .3 * bp(noise(14), 2000, 5000), .5), 1.2, .17)
for t in np.arange(20, 32, 2.1): add(amb, clack(.8, .4), t + rng.uniform(0, .8), .1, rng.uniform(-.6, .6))
bed(33.0, 42.0, norm(lp(noise(9), 400, 2), .5), 1.5, .045)               # room tone (almost silence)
cr = np.zeros(int(8.6 * SR), np.float32); tt = t_(8.6)
for f0, ph in [(4300, 0), (4650, 1.3)]:
    gate = (np.sin(2 * np.pi * 24 * tt + ph) > .55) * (np.sin(2 * np.pi * 1.6 * tt + ph) > -.1)
    cr += (np.sin(2 * np.pi * f0 * tt) * gate * .12).astype(np.float32)
bed(41.0, 49.6, cr, 1.8, .55)

# ---------------- voice ----------------
voice = stereo(); vspans = []
vol = None
for e in [e for e in EV if e['type'] == 'vo']:
    a, sr = sf.read(os.path.join(HERE, 'tts/out', e['id'] + '.wav')); a = a if a.ndim == 1 else a.mean(1)
    a = soxr.resample(a.astype(np.float32), sr, SR); a = hp(a, 90, 2)
    # look-ahead limiter first (peaky voice), then compress, then level
    a = limit(a, ceil=np.sqrt(np.mean(a ** 2)) * 3.4 + 1e-6, look=.005); a = compress(a, .18, 3.0)
    a = a * (0.12 / (np.sqrt(np.mean(a ** 2)) + 1e-9))
    add(voice, a, e['t'], 1.0, 0.0); vspans.append((e['t'], e['t'] + len(a) / SR))
voice = np.asarray(S.room(voice, size=.22, mix=.1), np.float32)[:N] if len(voice) else voice

# ---------------- bus ----------------
music = render_music()
fade = np.ones(N, np.float32)
def fade_out(t0, t1): i0, i1 = int(t0 * SR), int(t1 * SR); fade[i0:i1] *= np.linspace(1, 0, i1 - i0); fade[i1:] = 0
def fade_in(t0, t1): i0, i1 = int(t0 * SR), int(t1 * SR); fade[:i0] = 0; fade[i0:i1] *= np.linspace(0, 1, i1 - i0)
# silence in bar 11 (33.33-36.67): the score stops, then one felt-piano note
sil0, sil1 = bar(11), bar(12)
mask = np.ones(N, np.float32); i0, i1 = int((sil0 - .25) * SR), int(sil1 * SR); mask[i0:int(sil0 * SR)] *= np.linspace(1, 0, int(sil0 * SR) - i0); mask[int(sil0 * SR):i1] = 0
mask[int((DUR - 1.0) * SR):] *= np.linspace(1, 0, N - int((DUR - 1.0) * SR))
music *= mask[:, None]
# duck music under voice (smoothed)
duck = np.ones(N, np.float32)
for a0, a1 in vspans: duck[int((a0 - .1) * SR):int((a1 + .15) * SR)] = .6
k = int(.3 * SR); duck = np.convolve(duck, np.ones(k) / k, 'same').astype(np.float32)
music *= duck[:, None]
# level: voice about 8 dB over the music
def rms(x): return float(np.sqrt(np.mean(x ** 2)) + 1e-9)
vmask = np.zeros(N, bool)
for a0, a1 in vspans: vmask[int(a0 * SR):int(a1 * SR)] = True
mrms = rms(music[vmask]) if vmask.any() else rms(music)
music *= (rms(voice[vmask]) / 10 ** (8 / 20)) / mrms
mix = music + voice + sfx * .5 + amb * .9
mix = mix[:int(DUR * SR)]
mix = limit(mix.T, ceil=.9, look=.005).T if False else mix
for ch in range(2): mix[:, ch] = limit(mix[:, ch], ceil=.9, look=.005)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out/mix.wav'), mix, SR, subtype='PCM_24')
print('mix', mix.shape, 'peak', float(np.abs(mix).max()), 'rms', rms(mix))
print('\n'.join(S.credits(['piano', 'harp', 'glockenspiel', 'vibraphone_bowed'])))
