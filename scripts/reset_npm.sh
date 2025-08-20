rm -rf package-lock.json yarn.lock node_modules
cd ios
rm -rf Podfile.lock Pods
cd ..
npm i
npx expo prebuild