/**
 * 根据菜单生成菜单列表的字典表
 * return {101011:{name:'系统管理',root:true}}
 */

const modulesTable = (menus, table = {}) => {
	try {
		menus.forEach(({ id, name, dataType, path, dtos }) => {
			table[dataType] = { name, dtos, id, path };
			if (dtos.length > 0) { modulesTable(dtos, table); }
		});
		return table;
	} catch (error) { return {}; }
};

export default modulesTable;
