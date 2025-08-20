# rm -rf android/.gradle
# rm -rf android/.cxx
# rm -rf android/app/.cxx
# rm -rf android/app/build
# rm -rf ~/.gradle/caches
# rm -rf ~/.gradle/daemon
# rm -rf ~/.gradle/native
# rm -rf ~/.gradle/wrapper
cd android
./gradlew clean
./gradlew -stop
cd ..
