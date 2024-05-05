import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { availableLocations } from './../utils/helper';

const WeatherSettingWrapper = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 20px;
`;

const Title = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 30px;
`;

const StyledLabel = styled.label`
  display: block;
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 15px;
`;

const StyledSelect = styled.select`
  display: block;
  box-sizing: border-box;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.textColor};
  outline: none;
  width: 100%;
  max-width: 100%;
  color: ${({ theme }) => theme.textColor};
  font-size: 16px;
  padding: 7px 10px;
  margin-bottom: 40px;
  -webkit-appearance: none;
  -moz-appearance: none;
  box-shadow: none;
  outline: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > button {
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    user-select: none;
    margin: 0;
    letter-spacing: 0.3px;
    line-height: 1;
    cursor: pointer;
    overflow: visible;
    text-transform: none;
    border: 1px solid transparent;
    background-color: transparent;
    height: 35px;
    width: 80px;
    border-radius: 5px;
    font-size: 14px;

    &:focus,
    &.focus {
      outline: 0;
      box-shadow: none;
    }

    &::-moz-focus-inner {
      padding: 0;
      border-style: none;
    }
  }
`;

const Back = styled.button`
  && {
    color: ${({ theme }) => theme.textColor};
    border-color: ${({ theme }) => theme.textColor};
  }
`;

const Save = styled.button`
  && {
    color: white;
    background-color: #40a9f3;
  }
`;

const WeatherSetting = ({cityName, handleCurrentCityChange, handleCurrentPageChange}) => {
    const [locationName, setLocationName] = useState(cityName || availableLocations[0].cityName); 
    // 設定選項預設指向目前選中的城市
    useEffect(() => {
        // 從localStorage取得城市名稱並設定為預設值
        const savedCityName = localStorage.getItem('cityName');
        setLocationName(savedCityName || '');
    }, []); // 空的依賴陣列表示只在第一次渲染時執行
    
    const handleChange = (e) => {
        console.log(`使用者選取的地區位置為：${e.target.value}`);
        // 將使用者輸入的內容更新到React內的資料狀態
        setLocationName(e.target.value);
    };
    
    const handleSave = () => {
        console.log(`儲存的地區位置為：${locationName}`);
        handleCurrentCityChange(locationName);
        handleCurrentPageChange('WeatherCard'); //切換回WeatherCard頁面
        localStorage.setItem('cityName', locationName);
    };

    return (
        <WeatherSettingWrapper>
            <Title>設定</Title>
            {/* htmlFor是html的屬性，為了避免跟JS的for關鍵字衝突，使用htmlFor*/}
            <StyledLabel htmlFor='location'>地區</StyledLabel>
            {/*使用onChange搭配handleChange來監聽使用者的資料*/}
            {/*透過value可以讓資料跟畫面相對應*/}
            <StyledSelect id='location' name='location' onChange={handleChange} value={locationName}>
                {/*定義可以選擇的地區選項*/}
                {availableLocations.map(({cityName}) => (
                   <option value={cityName} key={cityName}>
                        {cityName}
                   </option> 
                ))}
            </StyledSelect>
            <ButtonGroup>
                <Back onClick={()=>handleCurrentPageChange('WeatherCard')}>返回</Back>
                <Save onClick={handleSave}>儲存</Save>
            </ButtonGroup>
        </WeatherSettingWrapper>
    );
};

export default WeatherSetting;