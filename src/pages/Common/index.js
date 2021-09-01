import React from 'react'
import './dist/index.css'
import { Link, withRouter } from 'react-router-dom'

class MainHeader extends React.Component {
    renderButton = () => {
        if (this.props.location.pathname === "/history")
            return (<li className="login-box">
                <button className="delete-button" onClick={this.handleOnclick}>删除历史</button>
            </li>)
        return (
            <>
                <li className="search-box"><input type="text" className="search" /></li>
                <li className="login-box"><button className="login-button">登录</button></li>
            </>
        )
    }
    handleOnclick = () => {
        if (window.localStorage.hasOwnProperty("historyID")) {

            delete window.localStorage.historyID
            this.props.history.push('/')

        }
        else
            alert("当前没有历史记录～")
    }
    render() {
        return (
            <header className="header-container">
                <Link to="/" className="logo"></Link>
                <ul className="item-list">
                    <li className="title-box"><Link to="/" className="title" >首页</Link></li>
                    {this.renderButton()}
                </ul>

            </header>
        )
    }
}

class BackToTop extends React.Component {

    state = {
        show:false,
        memScrollTop:0
    }

    backToTop = () => {

        let scrollTop = document.documentElement.scrollTop
        var subH = parseInt(scrollTop / 50);
        var timer = setInterval(function(){
            scrollTop -= subH;
            if(scrollTop <= 0){
                document.documentElement.scrollTop = 0;
                clearInterval(timer);
            }else{
                document.documentElement.scrollTop = scrollTop;
            }
        },1)    

    }

    componentDidMount(){
        window.addEventListener("scroll",() => {

            let scrollTop = document.documentElement.scrollTop

            if(scrollTop > 500 && scrollTop<1500 && scrollTop-this.state.memScrollTop > 0)
                this.setState({show:true,memScrollTop:scrollTop})
            else if(scrollTop>1500)
                this.setState({show:true,memScrollTop:scrollTop})
            else
                this.setState({show:false,memScrollTop:scrollTop})

        })
    }
  

    renderEle = () => {
        if (this.state.show) {
            return (
                <div className="top" onClick={this.backToTop}>
                    <i className="iconfont icon-top"></i>
                </div>
            )
        }
    }

    render() {
        return (
            <>
            {this.renderEle()}
            </>

        )
    }
}

export default withRouter(MainHeader);
export { BackToTop }