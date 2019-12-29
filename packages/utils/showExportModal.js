import { Modal } from 'antd';

/**
 * 通用导出Modal框
 * @param paramsObj Object类型。onOk：确定导出回调；history：react-router-dom中的history
 */
const showExportModal = (paramsObj) => {
	const { onOk, history } = paramsObj;

	Modal.confirm({
		title: '确定导出表格内容？',
		iconType: 'exclamation-circle',
		onOk: () => {
			onOk && onOk();
			if (onOk) {
				Modal.confirm({
					title: '导出任务已启动，是否前往“导出中心”查看进度？',
					okText: '是',
					cancelText: '暂不',
					iconType: 'check-circle',
					onOk: () => {
						if (history) {
							history.push('/file-center')
						}
					}
				});
			}
		}
	});
};

export default showExportModal;
