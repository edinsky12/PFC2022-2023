import { createContext, useState } from 'react';
const PantallasContext = createContext();
export const PantallasProvider = ({ children }) => {
  const [userLogged, setUserLogged] = useState('');
  const [groupId, setGroupId] = useState('');
  const [office, setOffice] = useState('');
  const [entryHourLogged, setEntryHourLogged] = useState('');
  const [exitHourLogged, setExitHourLogged] = useState('');
  const [workedHoursLogged, setWorkedHousLogged] = useState('');
  const [mondaySch, setMondaySch] = useState('');
  const [tuesdaySch, setTuesdaySch] = useState('');
  const [wednesdaySch, setWednesdaySch] = useState('');
  const [thursdaySch, setThursdaySch] = useState('');
  const [fridaySch, setFridaySch] = useState('');
  const [saturdaySch, setSaturdaySch] = useState('');
  const [sundaySch, setSundaySch] = useState('');
  return (
    <PantallasContext.Provider
      value={{
        userLogged,
        setUserLogged,
        groupId,
        setGroupId,
        office,
        setOffice,
        entryHourLogged,
        setEntryHourLogged,
        exitHourLogged,
        setExitHourLogged,
        workedHoursLogged,
        setWorkedHousLogged,
        mondaySch,
        setMondaySch,
        tuesdaySch,
        setTuesdaySch,
        wednesdaySch,
        setWednesdaySch,
        thursdaySch,
        setThursdaySch,
        fridaySch,
        setFridaySch,
        saturdaySch,
        setSaturdaySch,
        sundaySch,
        setSundaySch
      }}>
      {children}
    </PantallasContext.Provider>
  );
};
export default PantallasContext; 
