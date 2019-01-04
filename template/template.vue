<script>
import { fields } from './fields';

export default {
    created () {
        this.tableColumnsChecked = Object.keys(fields);
        this.getList();
    },
    mounted () {
        this.changeTableColumns();
    },
    data () {
        return {
            total: 0,
            current: 1,
            pageSize: 15,
            pageSizeOpts: [15, 30, 50, 100],
            isTableView: true,
            isShowMore: false,
            isCustomDrop: false,
            isLoading: false,
            isDetails: false,
            isClear: false,
            tableColumnsChecked: [],
            customList: fields,
            tableColumns: [],
            tableData: [],
            ids: '',
            sidx: 'pageId',
            sord: 'desc',
            formTitle: '',
            recordNum: '', // 表单页面的ID
            formInline: {},
            ruleInline: {},
            queryForm: {},
            queryAjaxPramas: {}
        };
    },
    methods: {
        customDropShow (bool) {
            this.isCustomDrop = bool;
        },
        changePage (val) {
            this.current = val;
            this.getList();
        },
        changePageSize (val) {
            this.pageSize = val;
            this.getList();
        },
        getList () {
            this.isLoading = false;
            let pramas = {
                page: this.current,
                rows: this.pageSize,
                sidx: this.sidx,
                sord: this.sord
            };
            let obj = Object.assign(pramas, this.queryAjaxPramas);
            // 下面是具体页面的列表请求
            /* axiosName(obj).then((res) => {
                if (res.data.data) {
                    this.isLoading = true;
                    this.total = res.data.page.count;
                    this.current = res.data.page.index !== 0 ? res.data.page.index : 1;
                    this.pageSize = res.data.page.size;
                    this.tableData = res.data.data;
                }
            }); */
        },
        sort (data) {
            if (data.order === 'normal') {
                this.sidx = 'pageId';
                this.sord = 'desc';
            } else {
                let str = data.key;
                str = str.replace(/Text$/, '');
                this.sidx = str;
                this.sord = data.order;
            }
            this.getList();
        },
        // 已勾选记录的ids
        selectObj (...data) {
            let strIds = [];
            data[0].forEach((currentValue, index, arr) => {
                strIds.push(currentValue.pageId);
            });
            this.ids = strIds.join();
        },
        changeTableColumns () {
            this.tableColumns = this.getTableColumns();
        },
        getTableColumns () {
            let tableColumnList = fields;
            let data = [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center',
                    fixed: 'left'
                },
                {
                    title: '编号',
                    key: 'pageId',
                    sortable: 'custom',
                    ellipsis: true,
                    width: 100,
                    fixed: 'left'
                }
            ];
            let action = {
                title: '操作',
                key: 'action',
                fixed: 'right',
                minWidth: 130, // 两个130 三个180
                render: (h, params) => {
                    return h('div', [
                        h('Button', { // 详情按钮
                            'class': {
                                detailsBS: true
                            },
                            props: {
                                type: 'ghost',
                                size: 'small'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    this.detailsRequest(params.row.pageId);
                                    this.recordNum = params.row.pageId;
                                    this.formTitle = '记录详情';
                                    this.isClear = false;
                                    this.isDetails = true;
                                    this.isTableView = false;
                                }
                            }
                        }, '详情')
                    ]);
                }
            };

            this.tableColumnsChecked.forEach(col => data.push(tableColumnList[col]));
            data.push(action);
            return data;
        },
        save () {
            console.log('save');
        },
        reset () {
            this.formInitialize();
        },
        close () {
            this.formInitialize();
            this.isDetails = false;
            this.isTableView = true;
        },
        formInitialize () {
            this.formInline = {};
        },
        detailsRequest (id) {
            // axiosName(id).then((res) => {
                // this.formInline = res.data.value.tbody;
            // });
        },
        clearQueryData () {
            this.queryForm = {};
            this.queryAjaxPramas = {};
            this.isClear = true;
            this.getList();
        },
        queryData () {
            this.queryAjaxPramas = {};
            for (let searchkey in this.queryForm) {
                if (this.queryForm[searchkey] !== null && this.queryForm[searchkey] !== '' && this.queryForm[searchkey] !== undefined) {
                    this.queryAjaxPramas[searchkey] = this.queryForm[searchkey];
                };
            };
            this.getList();
        }
    }
};
</script>

<style lang="less">

</style>