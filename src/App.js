// 使用npx create-react-app建立React程式，會預裝好React
import React, { useMemo, useState, useEffect } from 'react';
// npm install @emotion/styled @emotion/react
// CSS-in-JS套件
import styled from '@emotion/styled';
// Emotion提供ThemeProvider元件，只要像這樣<ThemeProvider theme={theme[currentTheme]}>把theme參數傳入
// ThemeProvider元件就可以把theme參數一起傳入元件包覆住的所有元件
import { ThemeProvider } from '@emotion/react';
import { getMoment } from './utils/helper';
import WeatherCard from './views/WeatherCard';
import useWeatherAPI from './hooks/useWeatherAPI';
import WeatherSetting from './views/WeatherSetting';
import { findLocation } from './utils/helper';

// emotion套件建立的CSS-in-JS的Styled Component
// React元件用大駝峰命名
// styled.div是建立一個div標籤元件
// ${({theme}) => theme.backgroundColor}; 這段是把傳入的props用解構賦值的方式取出theme物件的backgroundColor
// 等同於${(props) => props.theme.backgroundColor}
const Container = styled.div`
  background-color: ${({theme}) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 使用emotion這個套件所以可以把JS物件當作props傳進Styled Component裡使用
const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};
const AUTHORIZATION_KEY = 'CWA-D5793332-7FE9-41A3-8C95-3F9D8DCF9F42';

const App = () => {
  console.log('invoke function component');
  // useState回傳的第一個變數是資料，第二個變數是操作資料的函式
  // useState內的參數是指定資料預設值，可以是物件也可以是純量，物件可設定欄位
  const [currentTheme, setCurrentTheme] = useState('dark'); 

  // 使用useState定義目前要拉取天氣的地區currentCity
  // 從localStorage取出先前保存過的地區，若沒有保存過就給預設值
  // Lazy initialization：在useState裡這樣帶入函式，該函式的回傳值會是state的初始值且這個函式只有在元件首次載入(需要取得state的值)時才會執行
  const [currentCity, setCurrentCity] = useState(() => localStorage.getItem('cityName') || '臺北市');
  
  // 找出每支API需要帶入的locationName
  // 使用useMemo把取得的資料保存起來，只要currentCity沒有改變，即使元件重新轉譯也不用重新取值
  const currentLocation = useMemo(() => findLocation(currentCity), [currentCity]);
  const {cityName, locationName, sunriseCityName} = currentLocation;
  
  // 取得現在是day還是night
  const moment = useMemo(() => getMoment(sunriseCityName), [sunriseCityName]);

  // 這是設定theme的useEffect，判斷moment的值來決定主題用白色還深色，moment若有變動才會重新觸發
  useEffect(() => setCurrentTheme(moment === 'day' ? 'light' : 'dark'), [moment]);

  const [currentPage, setCurrentPage] = useState('WeatherCard');
  // 子元件不能直接修改父元件的狀態，所以要讓WeatherCard子元件修改App.js的currentPage，也就是要讓WeatherCard可以呼叫setCurrentPage
  // 建立一個新方法handleCurrentPageChange，在裡面呼叫setCurrentPage，並把這個方法透過props傳給WeatherCard
  const handleCurrentPageChange = (currentPage) => {
    setCurrentPage(currentPage);
  };

  const handleCurrentCityChange = (currentCity) => {
    setCurrentCity(currentCity);
  };

  const [weatherElement, fetchData] = useWeatherAPI({
    authorizationKey: AUTHORIZATION_KEY, 
    locationName: cityName,
    stationName: locationName});

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {console.log('render')}
        {
          currentPage === 'WeatherCard' && 
          (
            <WeatherCard cityName={cityName} weatherElement={weatherElement} moment={moment} fetchData={fetchData} handleCurrentPageChange={handleCurrentPageChange}/>
          )
        }
        { currentPage === 'WeatherSetting' && (<WeatherSetting handleCurrentCityChange={handleCurrentCityChange} handleCurrentPageChange={handleCurrentPageChange} />)}
      </Container>
    </ThemeProvider>
  );
};

export default App;
