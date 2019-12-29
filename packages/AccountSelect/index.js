// 支付账号筛选组件
import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Select, Modal, message } from 'antd';
import { inject } from 'react-ahax';
import { isEqual } from 'lodash';
import { callApi } from 'utils';
import './index.less';

const Option = Select.Option;
const confirm = Modal.confirm;

let flag = false;

@inject('$$context')
class AccountSelect extends (PureComponent || Component) {
	static defaultProps = {
		api: '/asset/listPayeeAccounts',
		isGeneral: false
	}

	constructor (props) {
		super(props);

		this.registerURL = '/pay/getRegisterURL';//获取跳转到的注册地址

		this.state = {
			namespaceId: '',
			communityId: '',
			organizationId: '',

			currentId: '', //当前的账户
			accounts: [], //所有的账户
			accountUrl: '', //跳转到的注册地址
		};
	}

	componentWillMount () {
		let { namespaceId, communityId, organizationId } = this.props.$$context;
		let cId = communityId || this.props.params.communityId || '';
		if (this.props.params.isGeneral) {
			cId = '-1';
		}
		this.setState({
			namespaceId,
			communityId: cId,
			organizationId,

			currentId: this.props.params.accountId
		}, () => {
			this.getAccounts();
			this.getRegisterURL();
		});
	}

	componentWillReceiveProps (nextProps) {
		if (!isEqual(nextProps.params, this.props.params)) {
			this.setState({
				currentId: nextProps.params.accountId,
				communityId: nextProps.params.isGeneral ? '-1' : nextProps.params.communityId,
			}, () => {
				this.getAccounts();
				this.getRegisterURL();
			});
		}
	}

	getAccounts (focusFirst) {
		if (!this.state.communityId) {
			return;
		}
		callApi({
			api: this.props.api,
			data: {
				...this.props.params,
				communityId: this.state.communityId,
				organizationId: this.state.organizationId,
			},
			success: (response) => {
				if (response) {
					let accounts = [];
					response.forEach((item) => {
						accounts.push({
							showName: (item.accountName || '空') + '/' + (item.accountAliasName || '空') + (Number(item.accountStatus) === 2 ? '' : '/(审核中)'),
							...item
						});
					});
					this.setState({
						accounts
					});

					if ((!this.state.currentId && accounts.length) || (focusFirst && accounts.length)) {
						this.props.onChange(accounts[0]);
						this.setState({
							currentId: accounts[0].accountId
						});
					}
				}
			},
			error: (e) => {
				console.error(e);
				if (e) {
					message.error(e.errorDescription);
				}
			}
		});
	}

	//获取跳转Url
	getRegisterURL = () => {
		let oId = this.state.organizationId;
		let cId = this.state.communityId === '-1' ? '0' : this.state.communityId;
		if (!oId || !cId || !this.state.namespaceId) {
			return;
		}
		callApi({
			api: this.registerURL,
			ignoreNamespaceId: true,
			data: {
				userId: 'EhOrganizations' + oId,
				tag1: cId,
				accountCode: 'NS' + this.state.namespaceId
			},
			success: (response) => {
				this.setState({
					accountUrl: response
				}, () => {
					if (flag) {
						this.showConfirm();
					}
				});
			},
			error: (e) => {
				console.error(e);
			}
		});
	}

	//选择账户时
	onChange = (v) => {
		this.setState({
			currentId: v
		});

		let accout = this.state.accounts.find((item) => {
			return Number(item.accountId) === Number(v);
		});

		this.props.onChange(accout);
	}

	//调用接口，跳转页面
	onAdd = () => {
		if (this.state.accountUrl && !flag) {
			this.showConfirm();
		} else {
			flag = true;
		}
	}

	//显示提示框
	showConfirm = () => {
		flag = false;
		window.open(this.state.accountUrl);
		confirm({
			title: '提交确认',
			content: '请确认你已成功提交企业账户信息',
			onOk: () => {
				//刷新账号
				this.getAccounts(true);
			},
			onCancel: () => {
				//刷新账号
				this.getAccounts();
			},
		});
	}

	render () {
		let v = '';
		if (this.state.currentId && this.state.accounts.length) {
			v = Number(this.state.currentId);
		} else if (this.state.accounts.length) {
			v = this.state.accounts[0].accountId;
		}
		return (
			<div value={this.state.currentId} className='eh-accountSelect'>
				<Select
					style={this.props.style}
					value={v}
					onChange={this.onChange.bind(this)}
					className='accountSelect'
				>
					{
						this.state.accounts.map((item) => {
							return (
								<Option key={item.accountId} value={Number(item.accountId)}>{item.showName}</Option>
							);
						})
					}

				</Select>
				<a className='addText' href="javascript:void(0)" style={{ marginLeft: 10 }} onClick={this.onAdd.bind(this)}>新增</a>
			</div>

		);
	}
}

AccountSelect.propTypes = {
	api: PropTypes.string, //获取账号的接口   使用form表单的不用传，(getFieldDecorator)
	style: PropTypes.object, //样式
	onChange: PropTypes.func, //点击某个账号的回调函数
	params: PropTypes.object, //accountId:默认选择的账号ID,communityId:项目ID
	accountId: PropTypes.string,
	isGeneral: PropTypes.bool, //是否创建通用账户，true：是  会设置communityId = -1
};

export default AccountSelect;
