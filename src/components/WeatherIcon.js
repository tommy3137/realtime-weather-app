import styled from '@emotion/styled';
// 將svg載入成React元件
import { ReactComponent as DayClear } from './../images/day-clear.svg';
import { ReactComponent as DayCloudy } from './../images/day-cloudy.svg';
import { ReactComponent as DayCloudyFog } from './../images/day-cloudy-fog.svg';
import { ReactComponent as DayFog } from './../images/day-fog.svg';
import { ReactComponent as DayPartiallyClearWithRain } from './../images/day-partially-clear-with-rain.svg';
import { ReactComponent as DaySnowing } from './../images/day-snowing.svg';
import { ReactComponent as DayThunderstorm } from './../images/day-thunderstorm.svg';
import { ReactComponent as NightClear } from './../images/night-clear.svg';
import { ReactComponent as NightCloudy } from './../images/night-cloudy.svg';
import { ReactComponent as NightCloudyFog } from './../images/night-cloudy-fog.svg';
import { ReactComponent as NightFog } from './../images/night-fog.svg';
import { ReactComponent as NightPartiallyClearWithRain } from './../images/night-partially-clear-with-rain.svg';
import { ReactComponent as NightSnowing } from './../images/night-snowing.svg';
import { ReactComponent as NightThunderstorm } from './../images/night-thunderstorm.svg';
import { useMemo } from 'react';

const IconContainer = styled.div`
    flex-basis: 30%;

    /* 為SVG限制高度 */
    svg {
        max-height: 110px;
    }
`;

// 定義天氣類別與代碼
const weatherTypes = {
    isThunderstorm: [15, 16, 17, 18, 21, 22, 33, 34, 35, 36, 41],
    isClear: [1],
    isCloudyFog: [25, 26, 27, 28],
    isCloudy: [2, 3, 4, 5, 6, 7],
    isFog: [24],
    isPartiallyClearWithRain: [
      8, 9, 10, 11, 12, 13, 14, 19, 20, 29, 30, 31, 32, 38, 39
    ],
    isSnowing: [23, 37, 42],
};
// 定義天氣類別對應的icon
const weatherIcons = {
    day: {
        isThunderstorm: <DayThunderstorm />,
        isClear: <DayClear />,
        isCloudyFog: <DayCloudyFog />,
        isCloudy: <DayCloudy />,
        isFog: <DayFog />,
        isPartiallyClearWithRain: <DayPartiallyClearWithRain />,
        isSnowing: <DaySnowing />,
    },
    night: {
        isThunderstorm: <NightThunderstorm />,
        isClear: <NightClear />,
        isCloudyFog: <NightCloudyFog />,
        isCloudy: <NightCloudy />,
        isFog: <NightFog />,
        isPartiallyClearWithRain: <NightPartiallyClearWithRain />,
        isSnowing: <NightSnowing />,
    },
};

const convertWeatherCodeToType = (weatherCode) => {
    // 使用Object.entries將weatherTypes物件的key跟value轉成陣列，把key取名為weatherType、value取名weatherCodes
    // 然後針對該陣列使用find方法跑迴圈，搭配includes方法檢驗API回傳的天氣代碼對應到哪種天氣型態
    // 找到的陣列會長這樣['isClear', [1]]，因此可以透過陣列的賦值，取出陣列的第一個元素，並取名成weatherType後回傳
    const [weatherType] = Object.entries(weatherTypes).find(
        ([weatherType, weatherCodes]) => weatherCodes.includes(Number(weatherCode))
    ) || [];

    return weatherType;
};

const WeatherIcon = ({weatherCode, moment}) => { 
    // useMemo可保存value類似快取，用法跟useCallback類似，只要第二個參數dependency array的值沒有變化就不會重新計算
    // 這裡就是只要weatherCode的值沒有變化，元件就不會重新呼叫convertWeatherCodeToType()取新的weatherType
    const weatherType = useMemo(() => convertWeatherCodeToType(weatherCode),[weatherCode]);
    const weatherIcon = weatherIcons[moment][weatherType];
    return (
        <IconContainer>
            {weatherIcon}
        </IconContainer>
    );
};

export default WeatherIcon;