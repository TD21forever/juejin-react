import React from 'react'
import './dist/index.css'
import {Link} from 'react-router-dom'

export default class MainHeader extends React.Component {
    render() {
        return (
            <header className="header-container">
                <Link to="/" className="logo"></Link>
                <ul className="item-list">
                    <li className="title-box"><Link to="/" className="title">首页</Link></li>
                    <li className="search-box"><input type="text" className="search"/></li>
                    <li className="login-box"><button className="login-button">登录</button></li>
                </ul>

            </header>
        )
    }
}