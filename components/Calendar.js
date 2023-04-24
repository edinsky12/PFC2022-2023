import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { TextInput, Button, Surface } from 'react-native-paper';
import PantallasProvider from '../components/ContextProvider';

function Calendar({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const { userLogged, setUserLogged } = useContext(PantallasProvider);
  const { groupId, setGroupId } = useContext(PantallasProvider);
  const { office } = useContext(PantallasProvider);
  const [data, setData] = useState([]);
  const [dayToday, setDayToday] = useState('');

  const today = moment().format('dddd');

  //TESTING ___________________________________________________________________________________

  const getSched = async () => {
    try {
      const response = await fetch('http://35.170.135.172:5000/api?schedule='+groupId);
      const json = await response.json();
      setData(json.schedule);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSched();
  }, []);

  //FICHAJE ___________________________________________________________________________________

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
      <View style={styles.bottomsection}>
        <View style={styles.userInfo}>
        <Text style={styles.userInfoText}>Usuario: {userLogged}</Text>
        <Text style={styles.userInfoText}>Oficina: {office}</Text>
        <Text style={styles.userInfoText}>Grupo de horario: Grupo {groupId}</Text>
        </View>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={data}
            keyExtractor={({ id }) => id}
            renderItem={({ item }) => (
              <Surface elevation={4} style={styles.flatlistElement}>

              <Text style={styles.calendarFont1}>{item.day}</Text>
              <Text style={styles.calendarFont2}>{item.hours} </Text>
      </Surface>
            )
            
            }
          />
        )}
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
  userInfo: {
    borderWidth: 0,
    borderColor: 'red',
  },
  flatlistElement: {
    innerHeight: 80,
    borderColor: '#F3FFFF',
    borderWidth: 5,
  },
  calendarFont1: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  calendarFont2: {
    fontSize: 20,
  },
    userInfoText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#0E66AA',
    textAlign: 'left',
  },
});

export default Calendar;
