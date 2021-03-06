import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Linking,
    ActivityIndicator,
} from 'react-native';

import Reactotron from 'reactotron-react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view';
import { encrypt } from 'react-native-simple-encryption';
import PopupDialog, {
    DialogTitle,
    ScaleAnimation,
} from 'react-native-popup-dialog';

import Fumi from '../../components/TextInputEffect/Fumi';
import DropdownAlert from '../../components/DropdownAlert';

import styles from './style';

export default class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            password_confirm: '',
            name: '',
            univ: '',
            major: '',
            isLoading: false,
        };
        this.Register = this.Register.bind(this);
        this.Linking = this.Linking.bind(this);
    }
    componentDidMount() {

    }
    Register() {
        this.setState({ isLoading: true });
        const params = {
            email: this.state.email,
            password: this.state.password,
            password_confirm: this.state.password_confirm,
            name: this.state.name,
            univ: this.state.univ,
            major: this.state.major,
        };
        let formBody = [];
        if (!params.email || !params.password || !params.password_confirm || !params.name ||
            !params.univ || !params.major) {
            this.setState({ isLoading: false }, () => {
                this.dropdown.alertWithType('error', '회원가입 실패', '6개 항목을 모두 입력해주세요.');
            });
        } else if (this.state.password !== this.state.password_confirm) {
            this.setState({ isLoading: false }, () => {
                this.dropdown.alertWithType('error', '회원가입 실패', '비밀번호와 비밀번호 확인 값이 다릅니다.');
            });
            // Alert.alert('', '비밀번호와 비밀번호 확인 값이 다릅니다.');
        } else {
            // params.password = cryptDecrypt('pretzelWOwAwesome', params.password);
            const enc1 = encrypt('thisiSfIrStSimplepretzelClientEncryptionKEy', params.password);
            params.password = encrypt('thisiSSeCONdSimplepretzelClientEncryptionKEy', enc1);
            for (const property in params) {
                const encodedKey = encodeURIComponent(property);
                const encodedValue = encodeURIComponent(params[property]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");

            fetch('http://13.124.147.152:8124/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formBody,
            }).then((res) => res.json())
                .then((rJSON) => {
                    if (rJSON.resultCode === 100) {
                        this.setState({ isLoading: false }, () => {
                            this.dialog.show();
                            this.dropdown.alertWithType('success', '회원가입 성공', rJSON.result);
                        });
                    } else {
                        this.setState({ isLoading: false }, () => {
                            this.dropdown.alertWithType('error', '회원가입 실패', rJSON.result);
                        });
                    }
                })
                .catch((err) => console.error(err));
        }
    }
    Linking() {
        const url = 'https://webmail.pusan.ac.kr';
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                // Reactotron.log('Can\'t handle url: ' + url);
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => Reactotron.error('An error occurred', err));
    }
    render() {
        const email = this.state.email;
        return (
            <View style={styles.container}>
                <View style={styles.cell_logo}>
                    <Image
                        source={require('../../../img/join+login/join,login_logotype.png')}
                        style={styles.logo} />
                </View>
                <View style={styles.cell_form}>
                    <View style={styles.cell_info} />
                    <KeyboardAwareView
                        animated={false}
                    >
                        <ScrollView
                            ref='scroll'
                            contentContainerStyle={{paddingVertical: 20}}
                        >
                            <Fumi
                                ref="email"
                                style={styles.textInput}
                                label={'이메일'}
                                iconClass={FontAwesomeIcon}
                                iconName={'envelope'}
                                iconColor={'#f95a25'}
                                secure={false}
                                onTextChanged={(email) => this.setState({email})}
                                autoCorrection={false}

                                autoCapital={'none'}/>
                            <Fumi
                                ref="name"
                                style={styles.textInput}
                                label={'이름'}
                                iconClass={FontAwesomeIcon}
                                iconName={'user-circle-o'}
                                iconColor={'#f95a25'}
                                secure={false}
                                onTextChanged={(name) => this.setState({name})}
                                autoCorrection={false}
                                myOnFocus={() =>
                                    this.refs.scroll.scrollTo({x: 0, y: 70, animated: true})
                                }
                                autoCapital={'none'}/>
                            <Fumi
                                ref="password"
                                style={styles.textInput}
                                label={'비밀번호'}
                                iconClass={FontAwesomeIcon}
                                iconName={'unlock-alt'}
                                iconColor={'#f95a25'}
                                secure={true}
                                onTextChanged={(password) => this.setState({password})}
                                autoCorrection={false}
                                myOnFocus={() =>
                                    this.refs.scroll.scrollTo({x: 0, y: 100, animated: true})
                                }
                                autoCapital={'none'}/>
                            <Fumi
                                ref="password_confirm"
                                style={styles.textInput}
                                label={'비밀번호 확인'}
                                iconClass={FontAwesomeIcon}
                                iconName={'unlock-alt'}
                                iconColor={'#f95a25'}
                                secure={true}
                                onTextChanged={(password_confirm) => this.setState({password_confirm})}
                                autoCorrection={false}
                                myOnFocus={() =>
                                    this.refs.scroll.scrollTo({x: 0, y: 130, animated: true})
                                }
                                autoCapital={'none'}/>
                            <Fumi
                                ref="univ"
                                style={styles.textInput}
                                label={'소속 대학'}
                                iconClass={FontAwesomeIcon}
                                iconName={'university'}
                                iconColor={'#f95a25'}
                                secure={false}
                                onTextChanged={(univ) => this.setState({univ})}
                                autoCorrection={false}
                                myOnFocus={() =>
                                    this.refs.scroll.scrollTo({x: 0, y: 200, animated: true})
                                }
                                autoCapital={'none'}/>
                            <Fumi
                                ref="major"
                                style={styles.textInput}
                                label={'소속 학과'}
                                iconClass={FontAwesomeIcon}
                                iconName={'graduation-cap'}
                                iconColor={'#f95a25'}
                                secure={false}
                                onTextChanged={(major) => this.setState({major})}
                                autoCorrection={false}
                                myOnFocus={() => {
                                    this.refs.scroll.scrollTo({x: 0, y: 250, animated: true})
                                    //  this._scrollToInput(ReactNative.findNodeHandle(event.target))
                                }}
                                autoCapital={'none'} />
                        </ScrollView>
                    </KeyboardAwareView>

                </View>

                <View style={styles.cell_register}>
                    <TouchableOpacity
                        style={styles.registerBtn}
                        onPress={this.Register}>
                        <Text style={styles.registerTxt}>회원 가입</Text>
                    </TouchableOpacity>
                </View>
                <PopupDialog
                    ref={(ref) => { this.dialog = ref; }}
                    dialogAnimation={new ScaleAnimation()}
                    dialogStyle={{ height: 200 }}
                    dialogTitle={
                        <DialogTitle
                            title="이메일 인증 안내"
                            titleTextStyle={{ color: '#f95a25' }}
                        />
                    }
                    onDismissed={() => {
                        this.props.navigation.navigate('auth');
                    }}
                >
                    <View style={styles.dialogContentView}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                            {email}로
                        </Text>
                        <Text style={styles.dialog_text}>
                                인증 메일이 발송되었습니다
                        </Text>
                        <TouchableOpacity
                            style={styles.dialog_touch}
                            onPress={this.Linking}>
                            <Text>부산대학교 웹메일로 이동</Text>
                        </TouchableOpacity>
                    </View>
                </PopupDialog>
                {
                    this.state.isLoading &&
                    <ActivityIndicator
                        style={styles.loading}
                        animating={this.state.isLoading}
                        size={'large'}
                    />
                }
                
                <DropdownAlert
                    ref={(ref) => this.dropdown = ref} />
            </View>
        );
    }
}
