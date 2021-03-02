import React from 'react'
import { Form, Input, Button, Popover, Notification } from 'element-react';
import axios from 'axios';
import './Login.css'


class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            password: '',
            username: ''
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    async onSubmit(e) {
        e.preventDefault();
        try {
            const response = await axios.get("http://127.0.0.1:8000/cas/webindex.do?act=verification&username=" + this.state.username + "&password=" + this.state.password);
            console.log(this.state.username,response.data.toString())
            if (this.state.username === response.data.toString()) {
                this.onLoginSuccess();
            }
            else {
                this.onLoginFall();
            }
        }
        catch (error) {
            this.onLoginFall();
        }

        this.props.onLogin();
    }

    onLoginSuccess() {
        Notification({
            title: '登录成功',
            message: '你刚刚尝试了登录，而且你居然登录成功了。玩个扫雷也要登录，这很反直觉。但没有办法，毕竟不得不请求后台。你可以通过开发者工具查看是不是真的向后台发送了请求。另外，这条消息需要你点消息框的叉才会关闭。',
            duration: 0,
            type: 'success'
        });
    }

    onLoginFall() {
        Notification({
            title: '登录失败',
            message: `你刚刚尝试了登录，但你登录失败了。
            玩个扫雷也要登录，这很反直觉。
            但没有办法，毕竟不得不请求后台。
            你可以通过开发者工具查看是不是真的向后台发送了请求。
            但如果只是因为登录失败就不让你玩「f2k扫雷」就太残忍了。所以你还是可以继续玩游戏。
            另外，这条消息需要你点消息框的叉才会关闭。`,
            duration: 0,
            type: 'warning'
        });
    }

    onChange(value, key) {
        this.setState({ [key]: value })
    }

    render() {
        return (
            <div className="Login-holder">
                <Popover placement="top" width="200" trigger="hover" content="——我也不知道">
                    <div>
                        <b>为什么</b>
                        <br />
                        <b>扫个雷</b>
                        <br />
                        <b>还需要输密码</b>
                        <br />
                        <b>？</b>
                        <br />
                        <b>其实随便输入一个用户名和密码就行了</b>
                    </div>
                </Popover>

                <br />
                <Form model={this.state.form} onSubmit={this.onSubmit} labelPosition='left' labelWidth='80'>
                    <Form.Item label="用户名">
                        <Input type="username" value={this.state.username} placeholder="用户名" onChange={(value) => { this.onChange(value, 'username') }}></Input>
                    </Form.Item>
                    <Form.Item label="密码">
                        <Input type="password" value={this.state.password} placeholder="密码" onChange={(value) => { this.onChange(value, 'password') }}></Input>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" nativeType="submit">登录</Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }

}

export default Login;