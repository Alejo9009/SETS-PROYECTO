import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Linking, FlatList, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../../App';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../components/context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';

type Anuncio = {
  idAnuncio: number;
  titulo: string;
  descripcion: string;
  fechaPublicacion: string;
  horaPublicacion: string;
  persona: number;
  apart: string;
  img_anuncio: string;
};

const AdminPrincipal = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnuncios = async () => {
      try {
        const response = await fetch('http://192.168.1.105:3001/api/anuncios');
        if (!response.ok) throw new Error('Error al obtener anuncios');
        const data = await response.json();
        setAnuncios(data);
      } catch (err) {
        console.error('Error fetching anuncios:', err);
        setError('Error al cargar anuncios');
      } finally {
        setLoading(false);
      }
    };

    fetchAnuncios();
  }, []);

  const AnuncioItem = ({ item }: { item: Anuncio }) => (
    <View style={styles.noticiaItem}>
      <View style={styles.noticiaHeader}>
        <Text style={styles.noticiaTitulo}>{item.titulo}</Text>
        <Text style={styles.noticiaFecha}>
          {new Date(item.fechaPublicacion).toLocaleDateString()} - {item.horaPublicacion}
        </Text>
      </View>
      <Text style={styles.noticiaResumen}>{item.descripcion}</Text>
    </View>
  );
   const handleLogout = async () => {
      Alert.alert(
        'Cerrar sesión',
        '¿Estás seguro de que deseas cerrar sesión?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Cerrar sesión',
            onPress: async () => {
              try {
                await logout();
                navigation.replace('HomeScreen');
              } catch (error) {
                console.error('Error al cerrar sesión:', error);
              }
            }
          }
        ]
      );
    };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>

        </View>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              source={require('./img/ajustes.png')}
              style={styles.logo}
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.userName}>Admin</Text>
              <Text style={styles.welcomeText}>
                {user ? `${user.Usuario} ` : 'Usuario'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.notificationIcon}
            onPress={() => navigation.navigate('Notificacionesadmin')}
          >
            <FontAwesome name="bell" size={28} color="#19800f" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>



        <View style={styles.menuContainer}>
          <View style={styles.menuRow}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('Parqueaderoadmin')}
            >

              <Image
                source={require('./img/estacionamiento (2).png')}
                style={styles.logo}
              />

              <Text style={styles.menuText}>Parqueaderos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('Torresadmin')}
            >

              <Image
                source={require('./img/apartamentos.png')}
                style={styles.logo}
              />

              <Text style={styles.menuText}>Torres</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.menuRow}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('ZonasComunesadmin')}
            >

              <Image
                source={require('./img/estadio.png')}
                style={styles.logo}
              />

              <Text style={styles.menuText}>Zonas comunes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => Linking.openURL('https://drive.google.com/file/d/1uEtHROICghEdsCqnssXrYiu202_HTX5m/view?usp=sharing')}
            >

              <Image
                source={require('./img/ayudar.png')}
                style={styles.logo}
              />

              <Text style={styles.menuText}>Manual de   Convivencia</Text>
            </TouchableOpacity>


          </View>
        </View>



        <View style={styles.menuContainer}>
          <View style={styles.menuRow}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('DatosUsuarios')}
            >

              <Image
                source={require('./img/datos-del-usuario.png')}
                style={styles.logo}
              />

              <Text style={styles.menuText}>Datos Usuarios</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('Citasadmin')}
            >
              <Image
                source={require('./img/cita.png')}
                style={styles.logo}
              />
              <Text style={styles.menuText}>Citas</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.menuRow}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('Contactanosadmin')}
            >

              <Image
                source={require('./img/cliente.png')}
                style={styles.logo}
              />

              <Text style={styles.menuText}>Contàctanos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('Pagosadmin')}
            >

              <Image
                source={require('./img/bolsa-de-dinero.gif')}
                style={styles.logo}
              />

              <Text style={styles.menuText}>Pagos</Text>
            </TouchableOpacity>

          </View>
        </View>



        <View style={styles.noticiasSection}>
          <View style={styles.sectionHeader}>

            <Text style={styles.sectionTitle}>🔔 ANUNCIOS  🔔 </Text>

            <View style={styles.divider} />
          </View>


          {loading ? (
            <ActivityIndicator size="large" color="#ffff" />

          ) : error ? (
            <Text style={{ color: '#ff6b6b', textAlign: 'center', marginVertical: 20 }}>
              {error}
            </Text>
          ) : (
            <FlatList
              data={anuncios}
              renderItem={AnuncioItem}
              keyExtractor={item => item.idAnuncio.toString()}
              scrollEnabled={false}
            />
          )}

        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Versión 0.1.0</Text>
        </View>
      </ScrollView>


      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('AdminPrincipal')}
        >
          <FontAwesome name="home" size={24} color="#ecf0f1" />
          <Text style={styles.navText}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('PerfilAdmin')}
        >
          <FontAwesome name="user" size={24} color="#ecf0f1" />
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={handleLogout}
          
        >
          <FontAwesome name="sign-out" size={24} color="#ecf0f1" />
          <Text style={styles.navText}>Cerrar Session</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 6,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 9,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 86,
    height: 70,
    borderRadius: 3,
    borderColor: '#d5dbdb',
  },
  welcomeText: {
    fontSize: 22,
    color: '#083004',
    fontWeight: '900',
    fontFamily: 'sans-serif-light',
  },
  userName: {
    fontSize: 27,
    fontWeight: '900',
    color: '#083004',
    fontFamily: 'sans-serif-light',
  },
  notificationIcon: {
    position: 'relative',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    color: '#fff',

  },
  notificationBadge: {
    position: 'absolute',
    top: 7,
    right: 5,
    width: 9,
    height: 9,
    borderRadius: 7,
    backgroundColor: '#e74c3c',
  },
  menuContainer: {
    marginBottom: 30,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  menuItem: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#0f420b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 2.45,
    shadowRadius: 45,
    elevation: 56,
  },
  menuIconContainer: {

    width: 60,
    height: 60,

    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuText: {
    fontSize: 14,
    color: '#184219',
    textAlign: 'center',
    fontWeight: '900',
  },
  noticiasSection: {
    marginBottom: 20,
    backgroundColor: '#0f420b',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#0f420b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    marginBottom: 15,
  },
  sectionTitleContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#0f420b',
    borderRadius: 5,
    marginBottom: 10,
    fontWeight: '900',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#fff',
    marginVertical: 5,
  },
  noticiaItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#c7ffc9',
  },
  noticiaImportante: {
    borderLeftWidth: 17,
    borderLeftColor: '#0b290c',
  },
  noticiaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  noticiaTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
  },
  noticiaFecha: {
    fontSize: 12,
    color: '#0b290c',
  },
  noticiaResumen: {
    fontSize: 14,
    color: '#0a120a',
    marginBottom: 15,
    lineHeight: 20,
  },
  verMasBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  verMasText: {
    color: '#0a120a',
    fontSize: 14,
    marginRight: 5,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
  },
  footerText: {
    fontSize: 12,
    color: '#0a120a',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#0a120a',
    paddingVertical: 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  navItem: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  navText: {
    fontSize: 14,
    color: '#ecf0f1',
    marginTop: 4,
    fontWeight: '900'
  },
  scrollContent: {
    padding: 15,
    paddingTop: 20,
  },
  welcomeContainer: {
    marginLeft: 5,
  },
});

export default AdminPrincipal;