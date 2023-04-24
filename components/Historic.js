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
  const [btnText, setBtnText] = useState('Entrada');
  const { userLogged, setUserLogged } = useContext(PantallasProvider);
  const { groupId, setGroupId } = useContext(PantallasProvider);
  const { office } = useContext(PantallasProvider);
  const [data, setData] = useState([]);
  const [dayToday, setDayToday] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const today = moment().format('dddd');

  //TESTING ___________________________________________________________________________________

  const getHistoric = async () => {
    try {
      const response = await fetch(
        'http://35.170.135.172:5000/api?historic='+userLogged
      );
      const json = await response.json();
      setData(json.historic);
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    getHistoric();
  }, []);

  const onRefresh = () => {
    //set isRefreshing to true
    setIsRefreshing(true);
    getHistoric();
    // and set isRefreshing to false at the end of your callApiMethod()
  };

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
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={data}
            keyExtractor={({ id }) => id}
            onRefresh={onRefresh}
            refreshing={isRefreshing}
            renderItem={({ item }) => (
              <Surface elevation={4} style={styles.flatlistElement}>
                <View style={styles.flatlistLayout}>
                  <View style={styles.flatlistElementLeft}>
                    <Text
                      style={[
                        styles.calendarFont2,
                        item.type === 'Entry'
                          ? { color: 'green' }
                          : { color: 'red' },
                      ]}>
                      {item.type}
                    </Text>
                  </View>
                  <View style={styles.flatlistElementRight}>
                    <Text style={styles.calendarFont1}>{item.employeeID} </Text>
                    <Text style={styles.calendarFont1}>{item.date} </Text>
                    <Text style={styles.calendarFont1}>{item.time} </Text>
                  </View>
                </View>
              </Surface>
            )}
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
    marginBottom: 20,
  },
  flatlistElement: {
    innerHeight: 80,
    borderColor: '#F3FFFF',
    borderWidth: 0,
  },
  flatlistElementRight: {
    innerHeight: 80,
    flex: 0.66,
    borderColor: '#F3FFFF',
    borderWidth: 1,
  },
  flatlistElementLeft: {
    innerHeight: 80,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.33,
    borderColor: '#F3FFFF',
    borderWidth: 2,
  },
  flatlistLayout: {
    flex: 1,
    flexDirection: 'row',
    innerHeight: 80,
    borderColor: '#F3FFFF',
    borderWidth: 5,
  },

  calendarFont1: {
    fontSize: 20,
    textAlign: 'right',
  },
  calendarFont2: {
    fontSize: 20,
    color: 'green',
    fontWeight: 'bold',
  },
});

export default Calendar;
