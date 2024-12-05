import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Card, CardContent, Typography, CircularProgress, Alert, Grid2 } from '@mui/material';

const Weather = () => {
    const [city, setCity] = useState(''); // 입력 받은 도시명
    const [weatherData, setWeatherData] = useState(null); // 현재 기상 정보
    const [fiveDayForecast, setFiveDayForecast] = useState([]); // 5일 예보
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState(null); // 에러 메시지

    const fetchWeather = async () => {
        if (!city) return;

        setLoading(true);
        setError(null);

        try {
            // 현재 기상 정보 가져오기
            const weatherResponse = await axios.get(`http://localhost:3000/weather/${city}`);
            setWeatherData(weatherResponse.data);

            // 5일 일기예보 가져오기
            const forecastResponse = await axios.get(`http://localhost:3000/weather/${city}/forecast`);
            setFiveDayForecast(forecastResponse.data);

            setLoading(false);
        } catch (error) {
            console.error("Error fetching weather data:", error);
            setError("도시 정보를 불러오는 중 오류가 발생했습니다.");
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            fetchWeather();
        }
    }

    return (
        <Container maxWidth="xl" style={{ marginTop: '50px', padding: '20px', borderRadius: '10px' }}>
            <Typography variant="h4" align="center" gutterBottom>
                날씨 정보 조회
            </Typography>

            <Grid2 container spacing={2} justifyContent="center">
                <Grid2 item xs={12}>
                    <TextField
                        fullWidth
                        label="도시 명을 입력하세요"
                        variant="outlined"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </Grid2>
                <Grid2 item xs={12}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={fetchWeather}
                        style={{ backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }} // Hover 효과
                    >
                        조회
                    </Button>
                </Grid2>
            </Grid2>

            {loading && <CircularProgress style={{ display: 'block', margin: '20px auto' }} />}

            {error && <Alert severity="error" style={{ marginTop: '20px' }}>{error}</Alert>}

            {weatherData && (
                <Card style={{ marginTop: '20px', borderImage: 'linear-grdient(to right, red 0%, orange 100%)', borderRadius: '50px', borderStyle: 'solid', borderColor: '#8ea6f5' }}>
                    <CardContent>
                        <Typography variant="h6">현재 기상 정보 ({city})</Typography>
                        <Typography>기상 상태: {weatherData.weatherStatus}</Typography>
                        <Typography>상세 상태: {weatherData.detailWeatherStatus}</Typography>
                        <Typography>현재 온도: {weatherData.currentTemp}</Typography>
                        <Typography>체감 온도: {weatherData.apparentTemp}</Typography>
                        <Typography>습도: {weatherData.currentHumi}</Typography>
                        <Typography>풍속: {weatherData.windSpeed}</Typography>
                        <Typography>강우량: {weatherData.rainfall}</Typography>
                        <Typography>강설량: {weatherData.snowfall}</Typography>
                        <img src={`http://openweathermap.org/img/wn/${weatherData.icon}@2x.png`} alt="Weather Icon" />
                    </CardContent>
                </Card>
            )}

            {Object.entries(fiveDayForecast).length > 0 && (
                <div>
                    <Typography variant="h6" style={{ fontWeight: 'bold', marginTop: '50px' }}>5일 간의 일기예보</Typography>
                    {Object.entries(fiveDayForecast).map(([date, forecasts]) => (
                        <div key={date}>
                            <Typography variant="h6" style={{ fontWeight: 'bold', marginTop: '20px' }}>{date}</Typography>
                            <Grid2 container spacing={2}>
                                {forecasts.map((forecast, index) => (
                                    <Grid2 item key={index}>
                                        <Card style={{ marginTop: '10px', borderRadius: '50px', borderStyle: 'solid', borderColor: '#8ea6f5' }}>
                                            <CardContent>
                                                <Typography>예측 시간: {forecast.forecastTime}</Typography>
                                                <Typography>기상 상태: {forecast.weatherStatus}</Typography>
                                                <Typography>상세 상태: {forecast.detailWeatherStatus}</Typography>
                                                <Typography>현재 온도: {forecast.currentTemp}</Typography>
                                                <Typography>체감 온도: {forecast.apparentTemp}</Typography>
                                                <Typography>습도: {forecast.currentHumi}</Typography>
                                                <Typography>풍속: {forecast.windSpeed}</Typography>
                                                <Typography>강우량: {forecast.rainfall}</Typography>
                                                <Typography>강설량: {forecast.snowfall}</Typography>
                                                <img src={`http://openweathermap.org/img/wn/${forecast.icon}@2x.png`} alt="Weather Icon" />
                                            </CardContent>
                                        </Card>
                                    </Grid2>
                                ))}
                            </Grid2>
                        </div>
                    ))}
                </div>
            )}
        </Container>
    );
};

export default Weather;