import React, {useState} from 'react'
import {Button, Col, Divider, Layout, List, Row} from "antd"
import {useTypedSelector} from "../../utils/hooks"
import {getCurrentFilter, getCurrentTodoListName, getTermFilteredTodos, getTodoListsLength} from "../../utils/selectors"
import AddNewItemFormModal from "../common/AddNewItemFormModal/AddNewItemFormModal";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store";
import {deleteTodoList, todoActions} from "../../store/todoReducer";

const {Content} = Layout

const MyContent = () => {

    const currentTodoListName = useTypedSelector(getCurrentTodoListName)
    const currentFilter = useTypedSelector(getCurrentFilter)
    const filteredTodos = useTypedSelector(getTermFilteredTodos)
    const todoListsLength = useTypedSelector(getTodoListsLength)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const dispatch = useDispatch<AppDispatch>()
    const onClickHandler = () => {
        setIsModalVisible(true)
    }

    const boundedAddTodo = (text: string) => {
        dispatch(todoActions.addTodoToList({todoTitle: text}))
    }

    return (
        <Content style={{margin: '24px 16px 0'}}>
            <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                {todoListsLength ? <>
                    <Divider orientation="left">
                        <strong>
                            {currentTodoListName}{currentFilter && (' | ' + currentFilter)}
                        </strong>
                        <Button type="link" danger onClick={() => {
                            dispatch(deleteTodoList())
                        }}>
                            Delete this list
                        </Button>
                    </Divider>
                    <List
                        size="large"
                        footer={<Button style={{padding: 0}} type={'link'} onClick={onClickHandler}>Add new
                            todo</Button>}
                        bordered
                        dataSource={filteredTodos}
                        renderItem={item =>
                            <List.Item key={item.id}>
                                <Todo id={item.id} completed={item.completed} title={item.title}/>
                            </List.Item>}
                    />
                    <AddNewItemFormModal title={'Add new todo'} isModalVisible={isModalVisible}
                                         setIsModalVisible={setIsModalVisible} addFunctionWrapper={boundedAddTodo}/>
                </> : <div>You don't have any todolist</div>}
            </div>
        </Content>
    )
}

interface IProps {
    title: string
    completed: boolean
    id: string
}

const Todo: React.FC<IProps> = ({title, completed, id}) => {

    const dispatch = useDispatch<AppDispatch>()

    const onDeleteHandler = () => {
        dispatch(todoActions.deleteTodo({todoId: id}))
    }

    const onMarkTodoHandler = () => {
        dispatch(todoActions.markTodo({todoId: id}))
    }

    return (
        <Row style={{width: '100%'}} justify={'space-between'}>
            <Col style={{textDecoration: completed ? 'line-through' : 'none'}} span={''}>
                <span style={{cursor: 'pointer'}} onClick={onMarkTodoHandler}>{title}</span>
            </Col>
            <Col style={{color: "red", cursor: "pointer"}} onClick={onDeleteHandler}>
                x
            </Col>
        </Row>
    )
}

export default MyContent