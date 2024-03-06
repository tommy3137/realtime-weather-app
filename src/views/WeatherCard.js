import React from "react";
// 將svg載入成React元件
import { ReactComponent as RainIcon } from './../images/rain.svg';
import { ReactComponent as AirFlowIcon } from './../images/airFlow.svg';
import { ReactComponent as RefreshIcon } from './../images/refresh.svg';
import { ReactComponent as LoadingIcon} from './../images/loading.svg';
import { ReactComponent as CogIcon } from './../images/cog.svg';

// npm install --save dayjs，處理跨瀏覽器時間問題
import dayjs from 'dayjs';
// 匯入自己完成的Icon元件
import WeatherIcon from './../components/WeatherIcon';
import styled from '@emotion/styled';

const WeatherCardWrapper = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: 0 1px 3px 0 #999999;
  background-color: ${({theme}) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 30px 15px;
`;
const Location = styled.div`
  font-size: 28px;
  color: ${({theme}) => theme.titleColor};
  margin-bottom: 20px;
`;
const Description = styled.div`
  font-size: 16px;
  color: ${({theme}) => theme.textColor};
  margin-bottom: 30px;
`;
const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;
const Temperature = styled.div`
  color: ${({theme}) => theme.temperatureColor};
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;
const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;
const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({theme}) => theme.textColor};
  margin-bottom: 20px;
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;
const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({theme}) => theme.textColor};
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;
const Refresh = styled.div`
  /* 旋轉動畫效果 */
  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: ${({theme}) => theme.textColor};
  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    /* 用animation屬性套用rotate動畫效果 */
    animation: rotate infinite 1.5s linear;
    animation-duration: ${({isLoading}) => (isLoading ? '1.5s': '0s')};
  }
`;

// emotion可為其他React元件增加樣式
const Cog = styled(CogIcon)`
  position: absolute;
  top: 30px;
  right: 15px;
  width: 15px;
  height: 15px;
  cursor: pointer;
`;

const WeatherCard = ({weatherElement, moment, fetchData, handleCurrentPageChange, cityName}) => {
    const {
        observationTime,
        description,
        windSpeed,
        temperature,
        rainPossibility,
        comfortability,
        isLoading,
        weatherCode
      } = weatherElement;    
  return(
    <WeatherCardWrapper>
        {/* 放入齒輪圖示，並讓它onClick事件可呼叫handleCurrentPageChange方法以更改畫面成WeatherSetting*/}
        <Cog onClick={() => handleCurrentPageChange('WeatherSetting')}/>
        <Location>{cityName}</Location>
        <Description>{description} {comfortability}</Description>
        <CurrentWeather>
        <Temperature>
            {Math.round(temperature)}<Celsius>°C</Celsius>
        </Temperature>
        {/*將weatherCode跟moment以props傳入WeatherIcon*/}
        <WeatherIcon weatherCode={weatherCode} moment={moment}/>
        </CurrentWeather>
        <AirFlow>
        <AirFlowIcon />{windSpeed} m/h
        </AirFlow>
        <Rain> 
        <RainIcon /> {rainPossibility}% 
        </Rain>
        <Refresh onClick={fetchData} isLoading={isLoading}>
        最後觀測時間：
        {/*Intl是原生的讓瀏覽器處理時間的JS方法，可以針對日期時間貨幣等進行多語系呈現*/}
        { new Intl.DateTimeFormat('zh-TW',{
            hour: 'numeric',
            minute: 'numeric'
        }).format(dayjs(observationTime))} 
        {/*JSX預設的空格最後在網頁呈現時會被過濾掉，如果希望頁面上元件跟元件之間有空格，可以這樣帶入空字串來加入空格*/}
        {' '}
        {isLoading ? <LoadingIcon/> : <RefreshIcon />} 
        </Refresh>
    </WeatherCardWrapper>
   );
};

export default WeatherCard;