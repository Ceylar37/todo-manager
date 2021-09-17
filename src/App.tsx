import React from 'react'
import 'antd/dist/antd.css';
import {Layout} from 'antd';
import './App.scss'
import MySider from "./components/MySider/MySider";
import MyHeader from "./components/MyHeader/MyHeader";
import MyContent from "./components/MyContent/MyContent";

const App = () => {

    return (
        <Layout style={{height: window.innerHeight - 1}}>
            <MySider/>
            <Layout>
                <MyHeader/>
                <MyContent/>
            </Layout>
        </Layout>
    )
}

export default App