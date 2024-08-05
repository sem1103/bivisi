# echo "Switching to branch master"
# git checkout master

# echo "Bulding app ..."
# npm run build

echo "Deploying files to server..."
scp -r dist/* bivisi@159.65.115.9:/var/www/bivisi/
echo "Done!"