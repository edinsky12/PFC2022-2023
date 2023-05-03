import React, { useEffect, useState, useContext } from 'react';
import { SquircleView } from 'react-native-figma-squircle';
import {
  ActivityIndicator,
  ImageBackground,
  Text,
  View,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import PantallasProvider from '../components/ContextProvider';
import Overlay from '../components/Overlay';

import moment from 'moment';

const Check = () => {
  const imageBg = require('../assets/imageBg.jpeg');
  const [isLoading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState([]);
  const [historic, setHistoric] = useState([]);
  const [lastReg, setLastReg] = useState([]);
  const [dayReg, setDayReg] = useState([]);

  const [dayToday, setDayToday] = useState('');
  const [entryTimeToday, setEntryTimeToday] = useState(null);
  const [exitTimeToday, setExitTimeToday] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [btnText, setBtnText] = useState('Entrada');
  const { userLogged } = useContext(PantallasProvider);
  const [user, setUser] = useState('');
  const { groupId } = useContext(PantallasProvider);
  const { office } = useContext(PantallasProvider);
  const [todayNow, setTodayNow] = useState('');
  const [today, setToday] = useState('');
  const [totalTime, setTotalTime] = useState('');
  const [timeSinceLastEntry, setTimeSinceLastEntry] = useState('');
  const [timeSinceLastExit, setTimeSinceLastExit] = useState('');
  const [timeTotal, setTimeTotal] = useState('');
  const [minutesShift, setMinutesShift] = useState('0');
  const [minutesWorked, setMinutesWorked] = useState('0');
  const [minutesInt, setMinutesInt] = useState(0);
  const [needsRefresh, setNeedsRefresh] = useState(true);

  const getSchedOnLoad = async () => {
    if (entryTimeToday == null) {
      setUser(userLogged);
      try {
        const response = await fetch(
          'http://35.170.135.172:5000/api?schedule=' + groupId
        );
        const json = await response.json();
        setSchedule(json.schedule);
        setDayToday(schedule[0].day);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        setEntryTimeToday(schedule[0].hours.split('-')[0]);
        setExitTimeToday(schedule[0].hours.split('-')[1]);
      }
    }
  };

  const getMinutesWorked = async () => {
    try {
      const response = await fetch(
        'http://35.170.135.172:5000/api?getMinutes=' + userLogged
      );
      const json = await response.json();
      setDayReg(json.minutes);
      setMinutesWorked(dayReg.time);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateMinutesWorked = async () => {
    let url = 'http://35.170.135.172:5000/api/enviaDatos';

    try {
      fetch(url, {
        method: 'POST',
        body: 'updateMinutes,"",' + userLogged + ',' + minutesInt,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getHistoric = async () => {
    try {
      const response = await fetch(
        'http://35.170.135.172:5000/api?historic=' + userLogged
      );
      const json = await response.json();
      setHistoric(json.historic);
      console.log(historic);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const getTimeInside = () => {
    if (isActive == true) {
      const t1 = moment(todayNow, 'HH:mm');
      const t2 = moment(lastReg.time, 'HH:mm');

      if (typeof t2 !== 'undefined') {
        const duration = moment.duration(t1.diff(t2));
        setMinutesShift(duration.asMinutes());
        if (duration.asHours() < 1) {
          setTimeSinceLastEntry(
            '(' + `${Math.floor(duration.asMinutes())} Minutes ago)`
          );
        } else {
          setTimeSinceLastEntry(
            '(' +
              `${Math.floor(
                duration.asHours()
              )} Hours ${duration.minutes()} Minutes ago` +
              ')'
          );
        }
      }
    }
  };

  const getHistoricOnLoad = async () => {
    if (needsRefresh == true) {
      try {
        const response = await fetch(
          'http://35.170.135.172:5000/api?historic=' + userLogged
        );
        const json = await response.json();
        setHistoric(json.historic);
        console.log(historic);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        setIsRefreshing(false);
        setNeedsRefresh(false);
      }
    }
  };

  const getLastRec = async () => {
    try {
      const response = await fetch(
        'http://35.170.135.172:5000/api?lastRec=' + userLogged
      );
      const json = await response.json();
      setLastReg(json.lastRec);
      console.log(lastReg);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
      getButtonState();
      alert(lastReg.total);
      setTotalTime(moment.utc(lastReg.total).format('HH:mm'));
    }
  };

  const getLastRecOnLoad = async () => {
    if (entryTimeToday == null) {
      showLoadingOverlay();
      try {
        const response = await fetch(
          'http://35.170.135.172:5000/api?lastRec=' + userLogged
        );
        const json = await response.json();
        setLastReg(json.lastRec);
        console.log(lastReg);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        setIsRefreshing(false);
        getButtonState();
        alert(lastReg.total);
        setTotalTime(moment.utc(lastReg.total).format('HH:mm'));
      }
    }
  };

  const getButtonState = () => {
    if (lastReg.type === 'Entry') {
      setIsActive(true);
      setBtnText('Exit');
    } else if (lastReg.type === 'Exit') {
      setIsActive(false);
      setBtnText('Entrada');
    }
  };

  const getTimeNow = () => {
    t1 = moment().format('HH:mm');
    setTodayNow(t1);
    t2 = moment().format('dddd');
    setToday(t2);
  };

  const sumTotalTime = () => {
    const totalMinutos = parseInt(minutesWorked) + parseInt(minutesShift);
    setMinutesInt(totalMinutos);
    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;
    if (horas < 1) {
      setTimeTotal(`${minutos} Minutes`);
    } else {
      setTimeTotal(
        `${horas} Hours ${minutos < 10 ? '0' + minutos : minutos} Minutes`
      );
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getTimeNow();
      getLastRec();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      getTimeInside();
      getMinutesWorked();
      sumTotalTime();
    }, 2000);
    return () => clearInterval(interval);
  }, [getTimeNow]);

  useEffect(() => {
    getHistoricOnLoad();
    getButtonState();
  }, [entryTimeToday]);

  useEffect(() => {
    getLastRecOnLoad();
    getSchedOnLoad();
  }, [getHistoricOnLoad]);

  const testButtonChange = () => {
    if (isActive == true) {
      let url = 'http://35.170.135.172:5000/api/enviaDatos';
      Alert.alert(
        'Succesful exit',
        'Exit of ' + userLogged + ' registered at: ' + todayNow,
        [{ text: 'OK' }]
      );
      setNeedsRefresh(true);
      getHistoricOnLoad();
      getLastRec();
      getHistoric();
      getTimeInside();
      getMinutesWorked();
      setIsActive(false);
      updateMinutesWorked();
      setBtnText('Entry');
      fetch(url, {
        method: 'POST',
        body: 'exit,"",' + userLogged + ',' + "''",
      });
      setTimeSinceLastEntry('0');
    } else if (isActive == false) {
      let url = 'http://35.170.135.172:5000/api/enviaDatos';
      Alert.alert(
        'Succesful entry',
        'Entry of ' + userLogged + ' registred at: ' + todayNow,
        [{ text: 'OK' }]
      );
      setNeedsRefresh(true);
      getHistoricOnLoad();
      getLastRec();
      getTimeInside();
      getMinutesWorked();
      setIsActive(true);
      setBtnText('Exit');
      fetch(url, {
        method: 'POST',
        body: 'entry,"",' + userLogged + ',' + "''",
      });
    }
  };

  const confirmationEntry = () =>
    Alert.alert('Entry', 'Check the entry?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      { text: 'OK', onPress: () => testButtonChange() },
    ]);

  const confirmationExit = () =>
    Alert.alert('Exit', 'Check the exit?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      { text: 'OK', onPress: () => testButtonChange() },
    ]);

  const showLoadingOverlay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 5000); // hide the overlay after 5 seconds
  };

  return (
    <View style={styles.layout}>
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" />
        </View>
      )}
      <View style={styles.imageHeader}>
        <ImageBackground
          source={imageBg}
          resizemode="stretch"
          style={styles.image}>
          <Text style={styles.headerText}>Welcome, {userLogged}</Text>
        </ImageBackground>
      </View>
      <View style={styles.topsection}>
        <View
          style={{
            backgroundColor: 'white',
            fontSize: 18,
            borderRadius: 20,
            borderTopEndRadius: 20,
            borderBottomEndRadius: 1,
            borderBottomLeftRadius: 1,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 3,
            width: 320,
            height: 50,
            borderColor: '#53D8FB',
            overflow: 'hidden',
          }}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.textInfoEntry}>
              {today}: {entryTimeToday} / {exitTimeToday}
            </Text>
          )}
        </View>
        <View
          style={{
            backgroundColor: 'white',
            fontSize: 18,
            borderRadius: 1,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 3,
            width: 320,
            height: 70,
            borderColor: '#53D8FB',
            overflow: 'hidden',
          }}>
          {isLoading ? (
            <Text></Text>
          ) : isActive ? (
            <Text style={styles.textInfoEntry}>
              {'You entered at: ' + lastReg.time + '\n' + timeSinceLastEntry}
            </Text>
          ) : (
            <Text style={styles.textInfoEntry}>You haven't entered</Text>
          )}
        </View>
        <View
          style={{
            backgroundColor: 'white',
            fontSize: 18,
            borderRadius: 20,
            borderTopLeftRadius: 1,
            borderTopEndRadius: 1,
            borderBottomEndRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 3,
            width: 320,
            height: 50,
            borderColor: '#53D8FB',
            overflow: 'hidden',
          }}>
          <Text style={styles.textInfoEntry}>
            {' '}
            {'Total today: ' + timeTotal}
          </Text>
        </View>
      </View>

      <View style={styles.middlesection}>
        {isLoading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          <SquircleView
            style={{
              width: 200,
              height: 200,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            squircleParams={{
              cornerSmoothing: 1,
              cornerRadius: 50,
              fillColor: '#0E66AA',
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: isActive ? '#0E66AA' : '#7590DA',
                borderRadius: isActive ? 50 : 140,
                borderWidth: isActive ? 10 : 10,
                borderColor: isActive ? '#53D8FB' : '#0E66AA',
                width: isActive ? 160 : 160,
                height: isActive ? 160 : 160,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                isActive ? confirmationExit() : confirmationEntry();
              }}
              title="Login"
              mode="contained">
              <Text style={styles.btnTextStyle}>{btnText}</Text>
            </TouchableOpacity>
          </SquircleView>
        )}
      </View>
      <Overlay />
    </View>
  );
};

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    justifyContent: 'center',
    padding: 0,
    backgroundColor: '#F3FFFF',
    textAlign: 'center',
    borderWidth: 0,
    borderColor: 'red',
  },
  imageHeader: {
    flex: 0.2,
  },
  topsection: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.4,
    borderWidth: 0,
    borderColor: 'green',
  },
  middlesection: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.4,
    borderWidth: 0,
    borderColor: 'purple',
  },

  headerText: {
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1.5,
    fontWeight: 'bold',
    fontSize: 40,
    color: 'white',
    textAlign: 'center',
  },
  btnTextStyle: {
    fontWeight: 'bold',
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
  },
  image: {
    flex: 2,
    justifyContent: 'center',
  },
  textInfoEntry: {
    justifyContent: 'center',
    textAlign: 'center',
    color: '#0E66AA',
    fontSize: 20,
  },
});

export default Check;
