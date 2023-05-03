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
import { Surface, Button } from 'react-native-paper';
import PantallasProvider from '../components/ContextProvider';
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

function Historic({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const { userLogged, setUserLogged } = useContext(PantallasProvider);
  const [data, setData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dateFilter, setDateFilter] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [calendarMode, setCalendarMode] = useState('');
  const [calendarDisplay, setCalendarDisplay] = useState('');

  const today = moment().format('dddd');

  const getHistoric = async () => {
    try {
      const response = await fetch(
        'http://35.170.135.172:5000/api?historic=' + userLogged
      );
      const json = await response.json();
      setData(json.historic);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDateFilter(moment.utc(currentDate).format('yyyy-MM-DD'));
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    getHistoric();
  };

  useEffect(() => {
    getHistoric();
  }, []);

  const handleCalendarModeDay = () => {
    showDatepicker();
    setCalendarMode("date");
    setCalendarDisplay("default");
  };
  const handleCalendarModeMonth = () => {
    alert('Unavailable option');
  };
  const handleQuit = () => {
    setDateFilter(null);
  }

  const filteredData = dateFilter
    ? data.filter((item) => item.date === dateFilter)
    : data;

  return (
    <View style={styles.layout}>
    <Text style={styles.text3}>{dateFilter ? 'Results from: '+ dateFilter : 'All results:'}</Text>
          <View style={styles.buttonContainer}>
            <Button style={styles.button} onPress={handleCalendarModeDay}><Text style={styles.text}>Pick day</Text></Button>
            <Button  style={styles.button} onPress={handleCalendarModeMonth}><Text style={styles.text}>Pick month</Text></Button>
            <FontAwesome disabled={!dateFilter} style={!dateFilter && { display: 'none' }} name={"remove"} onPress={handleQuit} size={40} color={'#0E66AA'} />
            {showDatePicker && (
              <DateTimePicker
                testID="datePicker"
                value={date}
                mode={calendarMode}
                display={calendarDisplay}
                onChange={handleDateChange}
              />
            )}
          </View>
      <View style={styles.bottomsection}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={filteredData}
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
  dateFilterContainer: {
   
  },
  bottomsection: {
    flex: 0.9,
  },
  flatlistElement: {
    innerHeight: 80,
    borderRadius: 20,
    borderColor: '#F3FFFF',
    borderWidth: 2,
  },
  flatlistElementRight: {
    borderRadius: 20,
    borderTopLeftRadius: 1,
    borderBottomLeftRadius: 1,
    innerHeight: 80,
    flex: 0.66,
    borderColor: '#0E66AA',
    borderWidth: 3,
  },
  flatlistElementLeft: {
    borderTopEndRadius: 1,
    borderBottomEndRadius: 1,
    borderRadius: 20,
    innerHeight: 80,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.33,
    borderColor: '#0E66AA',
    borderWidth: 3,
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
    button: {
    backgroundColor: '#0E66AA',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#53D8FB',
    width: 150,
    height: 50,
  },
  buttonContainer: {
 flex: 0.1,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontSize:14
  },
   text3: {
    color: '#0E66AA',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize:18,
    
  },
});

export default Historic;
