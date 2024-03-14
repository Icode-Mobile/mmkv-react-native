import { Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MMKV } from 'react-native-mmkv';

export default function App() {
  const [title, setTitle] = useState<string>('');
  const [data, setData] = useState<Array<{ title: string; id: number }>>([]);
  const storage = new MMKV();

  useEffect(() => {
    const subscriber = storage.addOnValueChangedListener((key) => {
      const data = storage.getString(key);
      if (data) {
        setData(JSON.parse(data));
      } else {
        setData([]);
      }
    });
    return () => subscriber.remove();
  }, [storage]);

  const deleteTask = () => {};

  const taskDone = () => {};

  const addTask = () => {
    if (title) {
      const data = storage.getString('@mmkv:task');

      if (data) {
        const prevData: Array<{ title: string; id: number }> = JSON.parse(data);
        const newTask = {
          id: prevData.length + 1,
          title,
        };
        const newData = [...prevData, newTask];
        storage.delete('@mmkv:task');
        storage.set('@mmkv:task', JSON.stringify(newData));
      } else {
        const newTask = {
          id: 1,
          title,
        };
        storage.set('@mmkv:task', JSON.stringify([newTask]));
      }
      alert('Salvo!');
    } else {
      Alert.alert('Campo obrigatório', 'Insira uma tarefa corretamente!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PESQUISAR</Text>
      <View style={styles.box}>
        <TextInput
          style={styles.input}
          placeholder='A fazer...'
          placeholderTextColor={'#1a1a1a'}
          cursorColor={'#1a1a1a'}
          onChangeText={(t) => setTitle(t)}
          value={title}
        />
        <TouchableOpacity
          disabled={!title}
          activeOpacity={0.8}
          onPress={addTask}
          style={[
            styles.button,
            { backgroundColor: !title ? '#999' : '#3a6ebd' },
          ]}
        >
          <Feather name='send' color={'#fff'} size={20} />
        </TouchableOpacity>
      </View>
      <StatusBar style='light' backgroundColor='#111' translucent />
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onLongPress={() => {
              Alert.alert('Escolha', 'O que deseja fazer?', [
                {
                  text: 'Apagar',
                  onPress: deleteTask,
                },
                {
                  text: 'Marcar',
                  onPress: taskDone,
                },
                {
                  text: 'Cancelar',
                  onPress: () => {},
                  style: 'cancel',
                },
              ]);
            }}
            style={styles.card}
          >
            <View style={styles.boxNumber}>
              <Text style={styles.numberId}>{item.id}</Text>
            </View>
            <Text style={styles.titleItem}>{item.title}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => item.title}
        style={{
          width: '100%',
        }}
        ListEmptyComponent={() => (
          <View style={styles.emptyTask}>
            <Text style={styles.emptyText}>Nenhuma tarefa inserida</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    paddingTop: 80,
    width: '100%',
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  box: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 5,
  },
  input: {
    backgroundColor: '#999',
    width: '85%',
    height: 50,
    paddingLeft: 10,
    borderRadius: 10,
  },
  button: {
    height: 50,
    width: 50,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  card: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    marginVertical: 10,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  boxNumber: {
    margin: 10,
    borderWidth: 1,
    borderColor: '#111',
    width: 35,
    height: 35,
    borderRadius: 20,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberId: {
    fontSize: 18,
    color: '#0d4894',
  },
  titleItem: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0d4894',
  },
  emptyTask: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 5,
    width: '100%',
  },
  emptyText: {
    color: '#9c9c9c',
    fontWeight: 'bold',
  },
});
