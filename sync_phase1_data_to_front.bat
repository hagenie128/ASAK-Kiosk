@echo off
echo Copy phase1 JSON files into frontend\data
set SRC=%~dp0..\data-pipeline\phase1\output
set DST=%~dp0data

if not exist "%DST%" mkdir "%DST%"

copy /Y "%SRC%\menus.json" "%DST%\menus.json"
copy /Y "%SRC%\dressings.json" "%DST%\dressings.json"
copy /Y "%SRC%\store_menus.json" "%DST%\store_menus.json"
copy /Y "%SRC%\dressing_nutrition_supplements.json" "%DST%\dressing_nutrition_supplements.json"

echo phase1 output copied to frontend\data
