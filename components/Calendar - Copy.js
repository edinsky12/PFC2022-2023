import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Alert,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import PantallasProvider from '../components/ContextProvider';

function LoginScreen({ navigation }) {
  const logo = require('../assets/logo.png');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [btnText, setBtnText] = useState('Entrada');
  const { userLogged, setUserLogged } = useContext(PantallasProvider);
  const { groupId, setGroupId } = useContext(PantallasProvider);

  const [mondayTime, setMondayTime] = useState('');
  const [tuesdayTime, setTuesdayTime] = useState('');
  const [wednesdayTime, setWednesdayTime] = useState('');
  const [thursdayTime, setThursdayTime] = useState('');
  const [fridayTime, setFridayTime] = useState('');
  const [saturdayTime, setSaturdayTime] = useState('');
  const [sundayTime, setSundayTime] = useState('');

  const [entryTimeToday, setEntryTimeToday] = useState('');
  const [exitTimeToday, setExitTimeToday] = useState('');
  const today = moment().format('dddd');

  //TESTING ___________________________________________________________________________________

  const test = () => {
    setEntryTimeToday('poronga');
    setExitTimeToday(mondayTime);
  }

  const getInfo = () => {
    getScheduleFromGroupId();
    alert(mondayTime);
    getEntryExitToday();
  };

  async function getScheduleFromGroupId() {
    let link = 'http://54.198.123.240:5000/api?schedule=';
    let url = link + groupId;
    try {
      const response = await fetch(url);
      const dats = await response.json();
      setMondayTime(dats.monday);
      setTuesdayTime(dats.tuesday);
      setWednesdayTime(dats.wednesday);
      setThursdayTime(dats.thursday);
      setFridayTime(dats.friday);
      setSaturdayTime(dats.saturday);
      setSundayTime(dats.sunday);
    } catch (error) {
      console.log(error);
    }
  }

  const getEntryExitToday = () => {
    switch (today) {
      case 'Monday':
        {
          setEntryTimeToday(mondayTime.split('-')[0]);
          setExitTimeToday(mondayTime.split('-')[1]);
        }
        break;
      case 'Tuesday':
        {
          setEntryTimeToday(tuesdayTime.split('-')[0]);
          setExitTimeToday(tuesdayTime.split('-')[1]);
        }
        break;
      case 'Wednesday':
        {
          setEntryTimeToday(wednesdayTime.split('-')[0]);
          setExitTimeToday(wednesdayTime.split('-')[1]);
        }
        break;
      case 'Thursday':
        {
          setEntryTimeToday(thursdayTime.split('-')[0]);
          setExitTimeToday(thursdayTime.split('-')[1]);
        }
        break;
      case 'Friday':
        {
          setEntryTimeToday(fridayTime.split('-')[0]);
          setExitTimeToday(fridayTime.split('-')[1]);
        }
        break;
      case 'Saturday':
        {
          setEntryTimeToday(saturdayTime.split('-')[0]);
          setExitTimeToday(saturdayTime.split('-')[1]);
        }
        break;
      case 'Sunday':
        {
          setEntryTimeToday(sundayTime.split('-')[0]);
          setExitTimeToday(sundayTime.split('-')[1]);
        }
        break;
    }
  };

  //FICHAJE ___________________________________________________________________________________

  const testButtonChange = () => {
    if (isActive == true) {
      let url = 'http://54.198.123.240:5000/api/enviaDatos';
      alert('Exit registered.');
      setIsActive(false);
      setBtnText('Entrada');
      fetch(url, {
        method: 'POST',
        body: 'exit,"",' + userLogged,
      });
    } else if (isActive == false) {
      let url = 'http://54.198.123.240:5000/api/enviaDatos';
      alert('Entry registered.');
      setIsActive(true);
      setBtnText('Salida');
      fetch(url, {
        method: 'POST',
        body: 'entry,"",' + userLogged,
      });
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsActive(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsActive(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <View style={styles.layout}>
      <View style={styles.infoBox}>
        <View style={styles.infoBoxSchedule}>
          <Button
            onPress={() => {
              getInfo();
            }}>
            {userLogged}
          </Button>
          <Button
            onPress={() => {
             test();
            }}>
            {groupId}
          </Button>
          <View
            style={{
              marginLeft: 24,
              marginRight: 24,
              fontSize: 18,
              borderRadius: 20,
              borderTopEndRadius: 20,
              borderTopLeftRadius: 20,
              borderWidth: 3,
              borderColor: '#53D8FB',
              height: 80,
              backgroundColor: '#DCE1E9',
              overflow: 'hidden',
              marginBottom: 15,
            }}>
            <View style={styles.infoTitle}>
              <Text style={styles.infoTextStyle}>Horario: </Text>
            </View>
            <View style={styles.infoData}>
              <Text style={styles.infoTextStyle}>
                {entryTimeToday} / {exitTimeToday}
              </Text>
            </View>
          </View>
          <View
            style={{
              marginLeft: 24,
              marginRight: 24,
              fontSize: 18,
              borderRadius: 20,
              borderTopEndRadius: 20,
              borderTopLeftRadius: 20,
              borderWidth: 3,
              borderColor: '#53D8FB',
              height: 80,
              backgroundColor: isActive && !isOnBreak ? '#83d66d' : '#DCE1E9',
              overflow: 'hidden',
              marginBottom: 15,
            }}>
            <View style={styles.infoTitle}>
              <Text style={styles.infoTextStyle}>Jornada: </Text>
            </View>

            <View>
              <View style={styles.infoData}>
                <Text style={styles.infoTextStyle}>XX:XX</Text>
              </View>
            </View>
          </View>
          <View
            style={{
              marginLeft: 24,
              marginRight: 24,
              fontSize: 18,
              borderRadius: 20,
              borderTopEndRadius: 20,
              borderTopLeftRadius: 20,
              borderWidth: 3,
              borderColor: '#53D8FB',
              height: 80,
              backgroundColor: isActive && isOnBreak ? '#83d66d' : '#DCE1E9',
              overflow: 'hidden',
              marginBottom: 15,
            }}>
            <View style={styles.infoTitle}>
              <Text style={styles.infoTextStyle}>Descanso: </Text>
            </View>
            <View style={styles.infoData}>
              <Text style={styles.infoTextStyle}>{'yo'}</Text>
            </View>
          </View>
        </View>
        <View></View>
      </View>
      <View style={styles.central}>
        <TouchableOpacity
          disabled={isOnBreak ? true : false}
          style={{
            backgroundColor: isOnBreak
              ? '#8E8D8D'
              : isActive
              ? '#0E66AA'
              : '#7590DA',
            borderRadius: isActive ? 50 : 200,
            borderWidth: isActive ? 10 : 10,
            borderColor: isOnBreak
              ? '#C6BEBE'
              : isActive
              ? '#53D8FB'
              : 'lightgrey',
            width: isActive ? 200 : 200,
            height: isActive ? 200 : 200,
            justifyContent: 'center',
            marginBottom: 20,
          }}
          onPress={() => {
            testButtonChange();
          }}
          title="Login"
          mode="contained">
          <Text style={styles.btnTextStyle}>{btnText}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={isActive ? false : true}
          style={{
            backgroundColor: isOnBreak ? 'green' : '#8E8D8D',
            borderRadius: isOnBreak ? 50 : 200,
            borderWidth: isOnBreak ? 10 : 10,
            borderColor: isOnBreak ? '#51c237' : '#C6BEBE',
            width: isActive ? 250 : 250,
            height: isActive ? 80 : 80,
            justifyContent: 'center',
          }}
          onPress={() => {
            testBreakChange();
          }}
          title="Login"
          mode="contained">
          <Text style={styles.btnTextStyle}>Descanso</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#F3FFFF',
    textAlign: 'center',
    borderWidth: 0,
    borderColor: 'red',
  },
  central: {
    flexDirection: 'column',
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    borderColor: 'red',
  },
  btnTextStyle: {
    fontWeight: 'bold',
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
  },
  infoTextStyle: {
    fontWeight: 'bold',
    fontSize: 24,
    color: 'black',
    textAlign: 'center',
  },
  infoBox: {
    flex: 0.5,
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#F3FFFF',
    textAlign: 'center',
    borderWidth: 0,
    borderColor: 'red',
  },
  infoTitle: {
    borderWidth: 0,
    borderColor: 'red',
  },
  infoData: {
    borderWidth: 0,
    borderColor: 'red',
    marginBottom: 10,
  },
  group1: {
    marginLeft: 24,
    marginRight: 24,
    fontSize: 18,
    borderRadius: 20,
    borderTopEndRadius: 20,
    borderTopLeftRadius: 20,
    borderWidth: 3,
    borderColor: '#53D8FB',
    height: 80,
    backgroundColor: '#DCE1E9',
    overflow: 'hidden',
    marginBottom: 15,
  },
  group2: {
    marginLeft: 24,
    marginRight: 24,
    fontSize: 18,
    borderRadius: 20,
    borderTopEndRadius: 20,
    borderTopLeftRadius: 20,
    borderWidth: 3,
    borderColor: '#53D8FB',
    height: 80,
    backgroundColor: '#DCE1E9',
    overflow: 'hidden',
    marginBottom: 15,
  },
  group3: {
    marginLeft: 24,
    marginRight: 24,
    fontSize: 18,
    borderRadius: 20,
    borderTopEndRadius: 20,
    borderTopLeftRadius: 20,
    borderWidth: 3,
    borderColor: '#53D8FB',
    height: 80,
    backgroundColor: '#DCE1E9',
    overflow: 'hidden',
    marginBottom: 15,
  },
  infoBoxHorario: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#F3FFFF',
    textAlign: 'center',
    borderWidth: 2,
    borderColor: 'red',
  },
});

export default LoginScreen;
