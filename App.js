import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer'
import { DataTable, page, setPage, setItemsPerPage, optionsPerPage, itemsPerPage, Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

const Drawer = createDrawerNavigator();
const numberOfItemsPerPageList = [2, 3, 4];

const items = [
  {
    key: 1,
    name: 'Page 1',
  },
  {
    key: 2,
    name: 'Page 2',
  },
  {
    key: 3,
    name: 'Page 3',
  },
];


const TableComponent = ({ headers, values }) => {
  if (!headers || !values) return null;
  const [page, setPage] = React.useState(0);
  const [numberOfItemsPerPage, onItemsPerPageChange] = React.useState(numberOfItemsPerPageList[0]);
  const from = page * numberOfItemsPerPage;
  const to = Math.min((page + 1) * numberOfItemsPerPage, items.length);
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'black',
      accent: 'gray'
    },
  };
  console.log(page);

  useEffect(() => {
    setPage(0);
  }, [numberOfItemsPerPage]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

      <DataTable style={{ width: 1000 }}>
        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(items.length / numberOfItemsPerPage)}
          onPageChange={page => setPage(page)}
          label={`${from + 1}-${to} of ${items.length}`}
          showFastPaginationControls
          numberOfItemsPerPageList={numberOfItemsPerPageList}
          numberOfItemsPerPage={numberOfItemsPerPage}
          onItemsPerPageChange={onItemsPerPageChange}
          selectPageDropdownLabel={'Rows per page'}
          shoeFastPaginationControls={true}
          theme={theme}
        />
        <DataTable.Row style={{ width: 1000 }}>
          <DataTable.Cell style={{ color: 'black' }} text>First Name</DataTable.Cell>
          <DataTable.Cell text>Last Name</DataTable.Cell>
          <DataTable.Cell text>Provider Email</DataTable.Cell>
          <DataTable.Cell text>Review</DataTable.Cell>
          <DataTable.Cell text>Rating</DataTable.Cell>
          <DataTable.Cell text>Review Completed</DataTable.Cell>
        </DataTable.Row>
        {/* {headers?.map(({ title, numeric }) => <DataTable.Title key={title} numeric={numeric}>{title}</DataTable.Title>)} */}
        {values?.map((value, index) => <DataTable.Row key={index}>
          {headers?.map(({ title }) => <DataTable.Cell key={title}>{value[title]}</DataTable.Cell>)}
        </DataTable.Row>)}

      </DataTable>
    </View>
  );
}

function _userLogin(email, password, setError, setToken, navigation) {
  if (email && password) {
    fetch("https://eas-cors-anywhere.herokuapp.com/https://dev-test-api.thebigpos.com/auth", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'codeexam'
      },
      body: JSON.stringify({
        email: email,
        password: password,
      })
    })
      .then((response) => { console.log(response); return response.json() })
      .then((responseData) => {
        console.log(responseData);
        setToken(responseData.token);
        navigation.navigate('Surveys');
      })
      .catch((error) => { console.error(error); setError('Wrong Username or Password') })
  }
}

function LoginScreen({ navigation, route }) {
  [email, setEmail] = useState(null);
  [password, setPassword] = useState(null);
  [error, setError] = useState(null);
  console.log(route.params.setToken);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Welcome</Text>
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <View>
        <TextInput
          value={email || ''}
          onChange={(event) => { setEmail(event.target.value) }}
          maxLength={20}
          placeholder="Email"
        />
        <TextInput
          value={password || ''}
          onChange={(event) => { setPassword(event.target.value) }}
          maxLength={20}
          placeholder="Password"
        />
      </View>
      <Button
        title="Login"
        onPress={() => _userLogin(email, password, setError, route.params.setToken, navigation)}
      />
    </View>
  );
}

function SurveysScreen({ navigation }) {
  [surveys, setSurveys] = useState(null);
  [error, setError] = useState(null);
  useEffect(() => {
    fetch("https://eas-cors-anywhere.herokuapp.com/https://dev-test-api.thebigpos.com/customer/surveys", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'codeexam'
      }
    })
      .then((response) => { console.log(response); return response.json() })
      .then((responseData) => {
        setSurveys(responseData)
        console.log('surveys receives ', responseData);
      })
      .catch((error) => { console.error(error); setError('Failed to retreive surveys.') })
  },
    [setSurveys, setError])
  const headers = [
    { title: 'FirstName' },
    { title: 'LastName' },
    { title: 'ProviderEmail' },
    { title: 'Review' },
    { title: 'Rating', numeric: true },
    { title: 'ReviewCompletedTimeStamp' },
  ]
  const values = surveys?.map(({ ID, Review, Rating, ProviderEmail, FirstName, LastName, ReviewCompletedTimeStamp }) => ({
    FirstName,
    LastName,
    ProviderEmail,
    Review,
    Rating,
    ReviewCompletedTimeStamp
  }));
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Surveys</Text>
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <Button
        title="Go to Users"
        onPress={() => navigation.navigate('Users')}
      />
      <TableComponent headers={headers} values={values} />
    </View>
  )
}

function UsersScreen({ navigation, route }) {
  const token = route.params.token;
  [users, setUsers] = useState(null);
  [error, setError] = useState(null);
  useEffect(() => {
    fetch("https://eas-cors-anywhere.herokuapp.com/https://dev-test-api.thebigpos.com/users", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'codeexam',
        'Authorization': 'Bearer ' + token
      }
    })
      .then((response) => { console.log(response); return response.json() })
      .then((responseData) => {
        setUsers(responseData)
        console.log('users receives ', responseData);
      })
      .catch((error) => { console.error(error); setError('Failed to retrieve users.') })
  },
    [setSurveys, setError])
  console.log('user screen receives token ' + token);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text> Users Screen</Text>
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <Button
        title="Go to Surveys/Home"
        onPress={() => navigation.navigate('Surveys')}
      />
    </View>
  );
}

const Stack = createStackNavigator();

function App() {
  [token, setToken] = useState(null);
  return (
    <PaperProvider style={{ color: 'black' }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen initialParams={{ setToken }} name="Login" component={LoginScreen} />
          <Stack.Screen name="Surveys" component={SurveysScreen} />
          <Stack.Screen initialParams={{ token }} name="Users" component={UsersScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;