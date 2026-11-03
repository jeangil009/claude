import urllib.request, os, re
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'
fams=['family=Cormorant+Garamond:ital,wght@0,500;1,400;1,500','family=Caveat:wght@500;600','family=IBM+Plex+Mono:wght@400']
os.makedirs('fonts',exist_ok=True); out=''; n=0
def get(u,binary=False):
    r=urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':UA}),timeout=60).read()
    return r if binary else r.decode()
for f in fams:
    css=get(f'https://fonts.googleapis.com/css2?{f}&display=block')
    # keep only latin and latin-ext blocks
    blocks=re.findall(r'/\* ([\w-]+) \*/\s*(@font-face \{.*?\})',css,re.S)
    for name,b in blocks:
        if name not in ('latin','latin-ext'): continue
        u=re.search(r'url\((https://[^)]+)\)',b).group(1)
        fn=f'f{n}.woff2'; n+=1
        open('fonts/'+fn,'wb').write(get(u,True)); out+=b.replace(u,'fonts/'+fn)+'\n'
open('fonts.css','w').write(out); print('fonts',n)
