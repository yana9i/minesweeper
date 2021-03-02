import React from 'react';
import { Button, Popover, Layout, Form, InputNumber, MessageBox, Dialog, Table } from 'element-react';
import _ from 'lodash';
import './Game.css';

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mineFiled: [[]],
            time: 0,
            mineCount: 0,
            flagCount: 0,
            customize: {
                visible: false,
                x: 8,
                y: 8,
                mineCount: 1
            },
            presentShowing: 'menu',
            hasGenerateFiled: false,
            rank: [],
            dialogVisible: false
        };
        this.table = {
            columns: [
                {
                    label: "尊姓大名",
                    prop: "name",
                    align: 'left'
                },
                {
                    label: "耗时",
                    prop: "time",
                    align: 'left',
                    sortable:true
                },
                {
                    label: "难度",
                    prop: "size",
                    align: 'left',
                    filters: [{ text: '初级', value: { size: 81, mineCount: 10 } }, { text: '中级', value: { size: 256, mineCount: 40 } }, { text: '高级', value: { size: 480, mineCount: 99 } }],
                    filterMethod(value, row) {
                        return row.size === value.size && row.mineCount === value.mineCount;
                    },
                    render(data) {
                        if (data.size === 81 && data.mineCount === 10) {
                            return '初级'
                        } else if (data.size === 256 && data.mineCount === 40) {
                            return '中级'
                        } else if (data.size === 480 && data.mineCount === 99) {
                            return '高级'
                        } else {
                            return `自定义：面积 ${data.size} 雷数 ${data.mineCount}`
                        }
                    }
                }
            ]
        };

        this.selectLevel = this.selectLevel.bind(this);
        this.onFiledClick = this.onFiledClick.bind(this);
        this.onFiledRightClick = this.onFiledRightClick.bind(this);
        this.rankPush = this.rankPush.bind(this);
    }

    selectLevel(x, y, mineCount) {
        if (x > 30)
            x = 30;
        if (y > 24)
            y = 24;
        if (x < 8)
            x = 8;
        if (y < 8)
            y = 8;
        if (mineCount > ((x - 1) * (y - 1)))
            mineCount = ((x - 1) * (y - 1));
        if (mineCount < 1)
            mineCount = 1;


        const mineFiled = [];
        let filedSize = x * y;
        let row = [];
        while (filedSize-- > 0) {
            row.push({
                code: (filedSize < mineCount ? 9 : 0),
                status: 'hidden'
            })
        }
        row = _.shuffle(row);
        let yi = y;
        while (yi-- > 0) {
            mineFiled.push(row.slice(0, x));
            row.splice(0, x);
        }

        this.isCounting = false;
        this.checkpoint = false;
        this.setState({ mineCount });
        this.setState({ mineFiled });
        this.setState({ time: 0 });
        this.setState({ flagCount: 0 })
        this.setState({ presentShowing: 'game' });
        this.setState({ hasGenerateFiled: false });
    }

    onFiledClick(x, y) {
        this.isCounting = true;
        this.setState(state => {
            if (!state.hasGenerateFiled) {
                this.generateFiled(x, y, state);
                state.hasGenerateFiled = true;
            };
            if (state.mineFiled[y][x].status !== 'hidden') {
                return;
            }
            if (state.mineFiled[y][x].code === 9) {
                this.gameOver();
            }
            else {
                if (state.mineFiled[y][x].code === 0) {
                    this.dfsClick(x, y, state.mineFiled);
                }
                state.mineFiled[y][x].status = 'clicked';
                this.hasWin(state);
            }
            return state;
        })

    }

    dfsClick(x, y, filed) {
        if (!filed[y])
            return false;
        if (!filed[y][x])
            return false;
        if (filed[y][x].status !== 'hidden')
            return false;
        if (filed[y][x].code !== 0) {
            if (filed[y][x].status === 'hidden')
                filed[y][x].status = 'clicked';
            return false;
        }

        filed[y][x].status = 'clicked';

        const arr = [-1, 0, 1];
        for (let xi of arr)
            for (let yi of arr)
                if (filed[y + yi])
                    if (filed[y + yi][x + xi])
                        if (filed[y + yi][x + xi].status === 'hidden')
                            this.dfsClick(x + xi, y + yi, filed)


    }

    generateFiled(beginX, beginY, state) {
        if (this.state.mineFiled[beginY][beginX].code === 9) {
            state.mineFiled[beginY][beginX].code = 0;
            for (let y of state.mineFiled) {
                let flag = false;
                for (let item of y) {
                    if (item.code === 0) {
                        item.code = 9;
                        flag = true;
                        break;
                    }
                }
                if (flag)
                    break;
            }
        }

        for (let y in state.mineFiled)
            for (let x in state.mineFiled[y])
                if (state.mineFiled[y][x].code === 9)
                    this.generateFiledNextToMine(x, y, state.mineFiled);

        return state
    }

    generateFiledNextToMine(x, y, filed) {
        x = Number.parseInt(x);
        y = Number.parseInt(y)

        if (filed[y - 1]) {
            if (filed[y - 1][x - 1])
                if (filed[y - 1][x - 1].code < 9)
                    filed[y - 1][x - 1].code++;
            if (filed[y - 1][x])
                if (filed[y - 1][x].code < 9)
                    filed[y - 1][x].code++;
            if (filed[y - 1][x + 1])
                if (filed[y - 1][x + 1].code < 9)
                    filed[y - 1][x + 1].code++;
        }
        if (filed[y + 1]) {
            if (filed[y + 1][x - 1])
                if (filed[y + 1][x - 1].code < 9)
                    filed[y + 1][x - 1].code++;
            if (filed[y + 1][x])
                if (filed[y + 1][x].code < 9)
                    filed[y + 1][x].code++;
            if (filed[y + 1][x + 1])
                if (filed[y + 1][x + 1].code < 9)
                    filed[y + 1][x + 1].code++;
        }

        if (filed[y][x + 1] && filed[y][x + 1].code < 9)
            filed[y][x + 1].code++;
        if (filed[y][x - 1] && filed[y][x - 1].code < 9)
            filed[y][x - 1].code++;

    }

    onFiledRightClick(x, y) {
        this.isCounting = true;
        this.setState(state => {
            if (state.mineFiled[y][x].status === 'hidden') {
                state.mineFiled[y][x].status = 'flag';
                state.flagCount++;
                this.hasWin(state);
                return state;
            }
            if (state.mineFiled[y][x].status === 'flag') {
                state.mineFiled[y][x].status = 'hidden'
                state.flagCount--;
                this.hasWin(state);
                return state;
            }
        })
    }

    gameOver() {
        this.isCounting = false;
        MessageBox.msgbox({
            title: '哎呀，游戏失败',
            message: '你踩到雷了。',
            type: 'error',
            confirmButtonText: '我投翔'
        });
        this.checkpoint = true;
        this.setState(state => {
            for (let y of state.mineFiled)
                for (let item of y) {
                    if (item.status === 'hidden' && item.code === 9)
                        item.status = 'boom';
                }
            return state;
        })
    }

    gameWin() {
        this.isCounting = false;
        MessageBox.prompt('尊姓大名', '你扫完了', {
            showCancelButton: false,
            confirmButtonText: '善'
        }).then((value) => {
            let name = value.value;
            if (!value.value) {
                name = '无名氏'
            }
            this.rankPush({
                name,
                time: this.state.time,
                size: this.state.mineFiled.length * this.state.mineFiled[0].length,
                mineCount: this.state.mineCount
            })
        });
        this.checkpoint = true

        this.setState(state => {
            for (let y of state.mineFiled)
                for (let item of y) {
                    if (item.status === 'hidden' && item.code === 9)
                        item.status = 'flag';
                }
            return state;
        })
    }

    hasWin(state) {
        const filedWin = () => {
            for (let y of state.mineFiled)
                for (let item of y)
                    if (item.code < 9 && item.status === 'hidden')
                        return false;
            return true;
        }
        const flagWin = () => {
            for (let y of state.mineFiled)
                for (let item of y)
                    if (item.code === 9 && item.status !== 'flag')
                        return false;
            return true;
        }
        if (filedWin() || flagWin())
            this.gameWin();
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
        document.querySelector('.el-dialog__wrapper').style.zIndex=999;
        document.querySelector('.v-modal').style.zIndex=998;
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState(state => {
            if (this.isCounting)
                state.time++;
            return state;
        })
    }

    rankPush(item) {
        this.setState(state => {
            state.rank.push(item)
            return state;
        })
    }

    render() {

        const menuElement = <div>
            <Layout.Row>
                <Button onClick={() => { this.selectLevel(9, 9, 10) }}>初级</Button>

            </Layout.Row>
            <br />
            <Layout.Row>
                <Button type="success" onClick={() => { this.selectLevel(16, 16, 40) }}>中级</Button>
            </Layout.Row>
            <br />
            <Layout.Row>
                <Button type="warning" onClick={() => { this.selectLevel(30, 16, 99) }}>高级</Button>
            </Layout.Row>
            <br />
            <Layout.Row>
                <Popover placement="top" width="360" trigger="click" visible={this.state.customize.visible} content={(
                    <div>
                        <h3>自定义雷区</h3>
                        <Form>
                            <Form.Item label="雷区宽度">
                                <InputNumber defaultValue={this.state.customize.x} onChange={(val) => { this.setState(state => state.customize.x = val) }} min="8" max="30"></InputNumber>
                            </Form.Item>
                            <Form.Item label="雷区高度">
                                <InputNumber defaultValue={this.state.customize.y} onChange={(val) => { this.setState(state => state.customize.y = val) }} min="8" max="24"></InputNumber>
                            </Form.Item>
                            <Form.Item label="雷区雷数">
                                <InputNumber defaultValue={this.state.customize.mineCount} onChange={(val) => { this.setState(state => state.customize.mineCount = val) }} min="1" max={(this.state.customize.x - 1) * (this.state.customize.y - 1)}></InputNumber>
                            </Form.Item>
                            <div >
                                <Button type="primary" size="mini" onClick={() => { this.selectLevel(this.state.customize.x, this.state.customize.y, this.state.customize.mineCount) }}>确定</Button>
                            </div>
                        </Form>
                    </div>
                )}>
                    <Button type="danger">自定义</Button>
                </Popover>
            </Layout.Row>
            <br />
            <Layout.Row>
                <Button type="info" onClick={() => { this.setState({ dialogVisible: true }) }}>排行榜</Button>
            </Layout.Row>

        </div>

        const filedElement = <div className='filedHolder' >
            <div>
                {this.state.mineFiled.map((row, indexy) => <div key={indexy}>
                    {row.map((item, indexx) =>
                        <span
                            key={indexx}
                            className={'filedCell ' + item.status + ' filed-code-' + item.code}
                            onMouseDown={event => {
                                event.preventDefault();
                                event.nativeEvent.stopImmediatePropagation();
                                if (this.checkpoint)
                                    return;
                                if (event.button === 0)
                                    this.onFiledClick(indexx, indexy);
                                if (event.button === 2)
                                    this.onFiledRightClick(indexx, indexy);
                            }}
                        >{item.status === 'boom' ? "💣" : item.status === 'flag' ? '🚩' : item.status === 'clicked' ? item.code > 0 ? item.code : '' : ''}</span>
                    )}
                </div>)}
            </div>

            <br />
            <div width='900px'>
                <Layout.Row>
                    <Layout.Col>
                        <span>用时：{this.state.time}</span>
                    </Layout.Col>
                    <Layout.Col>
                        <Button onClick={() => { this.setState({ presentShowing: 'menu' }) }}> 返回菜单 </Button>
                    </Layout.Col>
                    <Layout.Col>
                        <span>未标记的雷数：{this.state.mineCount - this.state.flagCount}</span>
                    </Layout.Col>
                </Layout.Row>
            </div>
        </div>

        const dialog = <Dialog
            title="排行榜"
            visible={this.state.dialogVisible}
            onCancel={() => this.setState({ dialogVisible: false })}
        >
            <Dialog.Body>
                {this.state.dialogVisible && (
                    <Table
                        style={{ width: '100%' }}
                        stripe={true}
                        columns={this.table.columns}
                        defaultSort={{prop:'time'}}
                        data={this.state.rank} />
                )}
            </Dialog.Body>
        </Dialog>

        return (
            <div>
                {this.state.presentShowing === 'menu' ? menuElement : null}
                {this.state.presentShowing === 'game' ? filedElement : null}
                {dialog}
            </div>
        )
    }

}

export default Game;