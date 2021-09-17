import React, {useState} from 'react'
import {Layout, Menu} from "antd"
import {addTodoList, todoActions} from "../../store/todoReducer"
import {useDispatch} from "react-redux"
import {AppDispatch} from "../../store"
import {useTypedSelector} from "../../utils/hooks"
import {SelectInfo} from "rc-menu/lib/interface";
import AddNewItemFormModal from "../common/AddNewItemFormModal/AddNewItemFormModal";
import {getTodoPage} from "../../utils/selectors";

const {Sider} = Layout

const MySider = () => {

    const dispatch = useDispatch<AppDispatch>()
    const [isCollapsed, editIsCollapsed] = useState<boolean>(false)
    const todo = useTypedSelector(getTodoPage)
    const [isModalVisible, setIsModalVisible] = useState(false)

    const onSelectHandler = (e: SelectInfo) => {
        if (e.key === 'new todo list') {
            setIsModalVisible(true)
            return
        }
        dispatch(todoActions.changeCurrentTodoListId({newCurrentId: e.key}))
    }

    const boundedAddTodoList = (text: string) => {
        dispatch(addTodoList(text))
    }

    return (
        <Sider theme={'light'} style={{height: '100%', overflow: 'auto'}} collapsible collapsed={isCollapsed}
                 onCollapse={editIsCollapsed} >
            <Menu defaultSelectedKeys={[todo.todoLists[0] && todo.todoLists[0].id]} selectedKeys={[todo.currentTodoListId]} mode="inline" onSelect={onSelectHandler}>
                {todo.todoLists.map(todoList =>
                    <Menu.Item key={todoList.id}>
                        {todoList.name}
                    </Menu.Item>
                )}
                <Menu.Item key={'new todo list'} style={{backgroundColor: '#E8E8E8'}}>
                    <strong>Add New Todo List</strong>
                </Menu.Item>
            </Menu>
            <AddNewItemFormModal title={'Add new todolist'} isModalVisible={isModalVisible}
                                 setIsModalVisible={setIsModalVisible} addFunctionWrapper={boundedAddTodoList}/>
        </Sider>
    )
}

export default MySider