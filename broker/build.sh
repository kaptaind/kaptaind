#!/bin/bash
tsc
cd ./src/ui
ng build
sudo cp -a ./dist/. ../../build/dist
sudo cp -a ./src/css/. ../../build/dist/css
sudo cp -a ./src/fonts/. ../../build/dist/fonts
sudo cp -a ./src/img/. ../../build/dist/img
sudo cp -a ./src/js/. ../../build/dist/js
sudo cp -a ./src/scss/. ../../build/dist/scss
sudo cp -a ./src/vendors/. ../../build/dist/vendors