if [[ -z "$1" ]]; then
    echo "No filename -> Command -> .loop-test.sh <test-file-name> <counter>"
    exit 1
fi
if [[ -z "$2" ]]; then
    echo "No counter -> Command -> .loop-test.sh <test-file-name> <counter>"
    exit 1
fi

echo "File for testing: $1"
echo "Number of tests: $2"

i=1
while [ $i -le $2 ]
do
    npm run silent-test "$1"
    if [[ $? -eq 1 ]]; then
        echo "Failed after $i attempts"
        break
    fi
    ((i++))
done
