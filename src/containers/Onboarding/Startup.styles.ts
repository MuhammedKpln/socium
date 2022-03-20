import { StyleSheet } from 'react-native'
import { Colors } from 'react-native-ui-lib'

export const StartupStyles = StyleSheet.create({
  heading: {
    fontSize: 36,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    textAlign: 'center',
  },
  imageBackground: {
    borderRadius: 200,
    padding: 50,
    width: 300,
    alignSelf: 'center',
  },
  title: {
    alignSelf: 'center',
    marginBottom: 10,
    fontSize: 30,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 20,
    color: Colors.grey30,
  },
  textContainer: {
    flexWrap: 'wrap',
    marginTop: 50,
    flexDirection: 'column',
  },
  pagerContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  pager: {
    width: 10,
    height: 10,
    backgroundColor: Colors.grey60,
    borderRadius: 10,
    marginRight: 10,
  },
  pagerActive: {
    backgroundColor: Colors.primary,
  },
})
