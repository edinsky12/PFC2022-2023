
import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, Image, Keyboard, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import PantallasProvider from '../components/ContextProvider';

function LoginScreen({ navigation }) {
  const logo = require('../assets/logo.png');

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [user, setUser] = useState('Edcafe');
  const [pass, setPass] = useState('1234');
  const [userApi, setUserApi] = useState('');
  const [passApi, setPassApi] = useState('');

  const { office, setOffice } = useContext(PantallasProvider);

  
  const { groupId, setGroupId } = useContext(PantallasProvider);
  const { setEntryHourLogged } = useContext(PantallasProvider);
  const { setExitHourLogged } = useContext(PantallasProvider);
  const { setBreakTimeLogged } = useContext(PantallasProvider);

  const { mondaySch, setMondaySch } = useContext(PantallasProvider);
  const { tuesdaySch, setTuesdaySch } = useContext(PantallasProvider);
  const { wednesdaySch, setWednesdaySch } = useContext(PantallasProvider);
  const { thursdaySch, setThursdaySch } = useContext(PantallasProvider);
  const { fridaySch, setFridaySch } = useContext(PantallasProvider);
  const { saturdaySch, setSaturdaySch } = useContext(PantallasProvider);
  const { sundaySch, setSundaySch } = useContext(PantallasProvider);
  const { userLogged, setUserLogged } = useContext(PantallasProvider);

  //LOGIN ___________________________________________________________________________________

  const login = async () => {
    let link = 'http://35.170.135.172:5000/api?login=';
    let url = link + user + ';' + pass;
    getDataFromUser()
    try {
      const response = await fetch(url);
      if (response.ok) {
        const dats = await response.json();
        if (dats.response == 'YES') {
          navigation.navigate('Screen1');
        } else {
          alert('Wrong Username or Password');
        }
      }
    } catch (error) {
      alert('Unable to retrieve information from the server, try again later.');
      console.log(error);
    }
  }

  async function getDataFromUser() {
    let link = 'http://35.170.135.172:5000/api?userInfo=';
    let url = link + user;
    try {
      const response = await fetch(url);
      
        const dats = await response.json();
        setUserLogged(dats.username);
        setGroupId(dats.group);
        setOffice(dats.office);
    } catch (error) {
      console.log(error);
    }
  }

  //LOGIN ___________________________________________________________________________________

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
      <View style={styles.topsection}>
        <Image
          style={{
            marginTop: isActive ? 0 : 200,
            width: isActive ? 180 : 280,
            height: isActive ? 180 : 280,
          }}
          source={logo}
        />
      </View>

      <View style={styles.middlesection}>
        <View>
          <TextInput
            style={styles.textinput}
            maxLength={20}
            underlineColor={'transparent'}
            value={user}
            onChangeText={setUser}
            label="Username..."
            placeholder="Write your username..."
          />
        </View>
        <View>
          <TextInput
            style={styles.textinput}
            maxLength={20}
            underlineColor={'transparent'}
            value={pass}
            onChangeText={setPass}
            label="Password..."
            placeholder="Write your password..."
          />
        </View>
        <View style={styles.botonesFinal}>
          <Button
            style={styles.button}
            title="Login"
            mode="contained"
            onPress={() => {
              login();
            }}>
            <Text style={{ textAlign: 'center' }}>Login </Text>
          </Button>
        </View>
        <Text>Version 0.1</Text>
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
  topsection: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.5,
    borderWidth: 0,
    borderColor: 'green',
  },

  middlesection: {
    justifyContent: 'center',
    flex: 0.5,
    borderWidth: 0,
    borderColor: 'purple',
  },

  textinput: {
    marginLeft: 24,
    marginRight: 24,
    fontSize: 18,
    borderRadius: 20,
    borderTopEndRadius: 20,
    borderTopLeftRadius: 20,
    borderWidth: 3,
    borderColor: '#53D8FB',
    height: 60,
    backgroundColor: '#DCE1E9',
    overflow: 'hidden',
    marginBottom: 15,
  },

  botonesFinal: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },

  button: {
    backgroundColor: '#0E66AA',
    borderRadius: 20,
    borderTopEndRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomEndRadius: 1,
    borderWidth: 3,
    borderColor: '#53D8FB',
    width: 130,
    height: 50,
    justifyContent: 'center',
  },
});

export default LoginScreen; 
