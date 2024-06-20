echo "Switching to branch master"
git checkout master

echo "Bulding app ..."
npm run build

echo "Deploying files to server..."
scp -r dist/* bivisi@157.230.120.254:/var/www/bivisi/
echo "Done!"