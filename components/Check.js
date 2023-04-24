import React, { useEffect, useState, useContext } from 'react';
import { SquircleView } from 'react-native-figma-squircle';
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Button } from 'react-native-paper';
import PantallasProvider from '../components/ContextProvider';

import moment from 'moment';

const Check = () => {
  const imageBg = require('../assets/imageBg.jpeg');
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  
  const [dayToday, setDayToday] = useState('');
  const [entryTimeToday, setEntryTimeToday] = useState('');
  const [exitTimeToday, setExitTimeToday] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [btnText, setBtnText] = useState('Entrada');
  const { userLogged } = useContext(PantallasProvider);
  const { groupId } = useContext(PantallasProvider);
  const { office } = useContext(PantallasProvider);
  const today = moment().format('dddd');
  const todayNow = moment().format('HH:mm');
  const [validationValue, setValidationValue] = useState('NO');

  const getSched = async () => {
    try {
      const response = await fetch(
        'http://35.170.135.172:5000/api?schedule=' + groupId
      );
      const json = await response.json();
      setData(json.schedule);
      setDayToday(data[0].day);
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setEntryTimeToday(data[0].hours.split('-')[0]);
      setExitTimeToday(data[0].hours.split('-')[1]);
    }
  };

  const getHistoric = async () => {
    try {
      const response = await fetch(
        'http://35.170.135.172:5000/api?historic=' + userLogged
      );
      const json = await response.json();
      setData2(json.historic);
      console.log(data2);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const getLastRec= async () => {
    try {
      const response = await fetch(
        'http://35.170.135.172:5000/api?lastRec=' + userLogged
      );
      const json = await response.json();
      setData3(json.lastRec);
      console.log(data3);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
      getButtonState();
    }
  };

  const getButtonState = () => {
    alert(data3.type)
    if (data3.type === 'Entry'){
      setIsActive(true);
    } else if  (data3.type === 'Exit'){
      setIsActive(false);
    }
  }

  useEffect(() => {
    if (entryTimeToday===''){
    getHistoric();
    }
  }, [entryTimeToday]);

useEffect(() => {
    getLastRec();
    getSched();
  }, [getHistoric]);


  const testButtonChange = () => {
    if (isActive == true) {
      let url = 'http://35.170.135.172:5000/api/enviaDatos';
      alert('Exit registered at: ' + todayNow);
      setIsActive(false);
      setBtnText('Entrada');
      fetch(url, {
        method: 'POST',
        body: 'exit,"",' + userLogged,
      });
    } else if (isActive == false) {
      let url = 'http://35.170.135.172:5000/api/enviaDatos';
      alert('Entry registered at: ' + todayNow);
      setIsActive(true);
      setBtnText('Salida');
      fetch(url, {
        method: 'POST',
        body: 'entry,"",' + userLogged,
      });
    }
  };

  return (
    <View style={styles.layout}>
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
            fontSize: 18,
            borderRadius: 20,
            borderTopEndRadius: 20,
            borderBottomEndRadius: 1,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 3,
            width: 350,
            height: 60,
            borderColor: '#53D8FB',
            overflow: 'hidden',
          }}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.text2}>
              {today}: {entryTimeToday} / {exitTimeToday}
            </Text>
          )}
        </View>
        <Button
          style={styles.button}
          onPress={() => {
            getSched();
            alert(data3.type);
          }}>
          <Text style={styles.text}>Update</Text>
        </Button>
      </View>
      <View style={styles.middlesection}>
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
            disabled={isOnBreak ? true : false}
            style={{
              backgroundColor: isOnBreak
                ? '#8E8D8D'
                : isActive
                ? '#0E66AA'
                : '#7590DA',
              borderRadius: isActive ? 50 : 140,
              borderWidth: isActive ? 10 : 10,
              borderColor: isOnBreak
                ? '#C6BEBE'
                : isActive
                ? '#53D8FB'
                : '#0E66AA',
              width: isActive ? 160 : 160,
              height: isActive ? 160 : 160,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              testButtonChange();
              
            }}
            title="Login"
            mode="contained">
            <Text style={styles.btnTextStyle}>{btnText}</Text>
          </TouchableOpacity>
        </SquircleView>
      </View>
      <View style={styles.bottomsection}>
        <Text style={styles.userInfoText}> Usuario: {userLogged}</Text>
        <Text style={styles.userInfoText}> Oficina: {office}</Text>
        <Text style={styles.userInfoText}>
          {' '}
          Grupo de horario: Grupo {groupId}
        </Text>
      </View>
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
    flex: 0.3,
  },
  topsection: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.4,
    borderWidth: 0,
    borderColor: 'purple',
  },
  middlesection: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.7,
    borderWidth: 0,
    borderColor: 'purple',
  },
  bottomsection: {
    justifyContent: 'center',
    flex: 0.2,
    borderWidth: 0,
    borderColor: 'purple',
  },
  button: {
    backgroundColor: '#0E66AA',
    borderRadius: 20,
    marginLeft: 200,
    borderTopEndRadius: 1,
    borderTopLeftRadius: 20,
    borderBottomEndRadius: 20,
    borderWidth: 3,
    borderColor: '#53D8FB',
    width: 130,
    height: 50,
    justifyContent: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
  },
  userInfoText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#0E66AA',
    textAlign: 'left',
  },
  text: { textAlign: 'center', color: 'white' },
  text2: {
    textAlign: 'center',
    color: '#0E66AA',
    justifyContent: 'center',
    fontSize: 25,
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
});

export default Check;
