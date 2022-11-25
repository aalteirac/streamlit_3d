sed -i '' '/#begin/,/#end/c\ 
    #begin \
    version="'$1'", \
    #end
' setup.py 
git add .
git commit -m "auto-release"
git push
gh release create v$1 -p --notes "auto-release"
