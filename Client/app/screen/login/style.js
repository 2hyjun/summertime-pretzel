import {
    StyleSheet,
    Platform,
} from 'react-native';

import { height, width, totalSize } from 'react-native-dimension';

const cellFormHeight = Platform.OS === 'ios' ? height(40) : height(43);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#EAEAEA',
    },
    cell_logo: {
        height: height(15),
        alignItems: 'center',
    },
    logo: {
        marginTop: 60,
        resizeMode: 'center',
    },
    cell_form: {
        marginTop: height(10),
        height: cellFormHeight,
        // backgroundColor: 'skyblue',
    },
    form_email: {
        flex: 1,
        borderWidth: 3,
        borderColor: '#EAEAEA',
        borderRadius: 17,
        backgroundColor: 'white',
        marginLeft: 30,
        marginRight: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        width: width(80),
    },
    sae_form_email: {
        flex: 1,
        marginLeft: 30,
        marginRight: 30,
        borderRadius: 5,
        borderColor: '#EAEAEA',
    },
    form_pw: {
        flex: 1,
        borderWidth: 3,
        borderColor: '#EAEAEA',
        borderRadius: 17,
        backgroundColor: 'white',
        marginLeft: 30,
        marginRight: 30,
        flexDirection: 'row',
    },
    pw_icon: {
        flex: 1,
        marginLeft: 10,
        height: 30,
        width: 30,
        resizeMode: 'center',
    },
    pw_txt: {
        flex: 5,
        marginRight: 30,
    },
    form_config: {
        flex: 2,
        marginTop: 20,
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 20,
        alignItems: 'center',
    },
    config_signin: {
        flex: 1.6,
        borderRadius: 10,
        backgroundColor: '#d3e229',
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
    },
    signin_txt: {
        fontSize: totalSize(2.3),
        fontWeight: 'bold',
    },
    config_forgot_pw: {
        flex: 1,
        borderRadius: 17,
        marginTop: 10,
    },
    config_register: {
        flex: 1,
        borderRadius: 17,
        marginBottom: 10,
    },
    cell_wave: {
        height: height(40),
        alignItems: 'center',
    },
    wave: {
        flex: 1,
        alignSelf: 'flex-end',
        width: width(100),
        // resizeMode: 'contain'
    },
    kav: {
        flex: 1,
    },
});

export default styles;
