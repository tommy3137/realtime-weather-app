import { useState, useCallback, useEffect } from "react";


const fetchWeatherForcast = ({authorizationKey, locationName}) => {
    return fetch(
      `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorizationKey}&locationName=${locationName}`
    )
    .then((response) => response.json())
    .then((data) => {
      const locationData = data.records.location[0];
      // 使用reduce過濾出想要的欄位
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if(['Wx','PoP','CI'].includes(item.elementName)){
            neededElements[item.elementName] = item.time[0].parameter;
          }
          return neededElements;
        },
        {}
      );
      return {
        description: weatherElements.Wx.parameterName,
        weatherCode: weatherElements.Wx.parameterValue,
        rainPossibility: weatherElements.PoP.parameterName,
        comfortability: weatherElements.CI.parameterName
      };
    });
  };
  const fetchCurrentWeather = ({authorizationKey, stationName}) => {
    // 這裡開始fetch API
    return fetch(
      `https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${authorizationKey}&StationName=${stationName}`
    )
    .then((response) => response.json())
    .then((data) => {
      const locationData = data.records.Station[0];
      const weatherElements = locationData.WeatherElement;
      return {
        windSpeed: weatherElements.WindSpeed,
        observationTime: locationData.ObsTime.DateTime,
        locationName: locationData.StationName,
        temperature: weatherElements.AirTemperature
      };
    });
  };

const useWeatherAPI = ({authorizationKey, locationName, stationName}) => {
    const [weatherElement, setWeatherElement] = useState({
        locationName: '',
        description: '',
        windSpeed: 0,
        temperature: 0,
        rainPossibility: 0,
        observationTime: new Date(),
        comfortability: '',
        weatherCode: 0,
        isLoading: true
      });

    // 假如函式不需要共用的話可以直接定義在useEffect裡面
    // React內資料狀態有變動時，整個用來產生React元件的函式都會再重新執行一次，也就是說每次資料狀態有變更時，這個fetchData函式都會重新宣告定義一次(分配到不同記憶體，跟物件概念一樣)
    // 使用useCallback這個React Hooks可以把fetchData這個函式保存下來，不會因為元件重新render而重新宣告定義
    // useCallback用法跟useEffect幾乎一樣，只有第二個參數的dependencies陣列有改變時，才會產生並回傳新的一個函式
    const fetchData = useCallback(async () => {
        // 這裡目的是先讓isLoading開始轉，把isLoading設為true
        // setState帶入函式的話可以取得前一次的資料狀態
        setWeatherElement((prevState)=>({
        ...prevState, // 解構賦值，可把舊資料帶入新物件，只有下面更新的欄位會被取代
        isLoading: true
        }));

        // 使用Promise.all搭配await等待兩個API都取得回應後再繼續
        const [currentWeather, weatherForcast] = await Promise.all(
            [
                fetchCurrentWeather({authorizationKey, stationName}), 
                fetchWeatherForcast({authorizationKey, locationName})
            ]);

        // 將取得的資料透過物件的解構賦值放入
        setWeatherElement({
        ...currentWeather,
        ...weatherForcast,
        isLoading: false
        });
    }, [authorizationKey, stationName, locationName]); // 這樣就是這三個參數只要都不動就不會重新觸發fetchData

    // useEffect這個Hook參數為一個函式，會在元件render完立刻呼叫
    // 注意若在函式內更新元件，可能會造成無窮迴圈（render元件->呼叫函式更新元件->重新render元件->...）
    // 所以要帶入第二個參數「dependencies」，只要每次重新render後陣列內的元素沒有被改變，就不會重新執行useEffect的函式
    // 因此只想要在頁面第一次載入時呼叫函式，只要把dependencies設為空陣列即可
    // fetchData現在為useCallback回傳的函式，使用useCallback後，只要useEffect中的dependencies沒有變，它回傳的就可以指向同一個函式。
    // 再把這個fetchData放到useEffect的dependencies後，就不會重新呼叫useEffect裡的函式
    // 大部分時候不用useCallback，直接產生新的函式沒關係
    useEffect(() => {
        console.log('exeute function in useEffect');
        fetchData();
    },[fetchData]);

    // 一般的React元件最後回傳JSX，但Custom Hook中最後回傳的可以是讓其他React元件使用的資料或方法
    // 就像用useState會回傳的是一個資料狀態(weatherElement)跟一個改變資料狀態的方法(fetchData)
    return [weatherElement, fetchData];
};

export default useWeatherAPI;