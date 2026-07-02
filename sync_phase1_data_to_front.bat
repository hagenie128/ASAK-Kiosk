@echo off
set SRC=c:\ha-team\data-pipeline\phase1\output
set DST=c:\ha-team\frontend\data

if not exist "%DST%" mkdir "%DST%"

copy /Y "%SRC%\menus.json" "%DST%\menus.json"
copy /Y "%SRC%\dressings.json" "%DST%\dressings.json"
copy /Y "%SRC%\store_menus.json" "%DST%\store_menus.json"
copy /Y "%SRC%\dressing_nutrition_supplements.json" "%DST%\dressing_nutrition_supplements.json"

echo phase1 output copied to frontend\data
