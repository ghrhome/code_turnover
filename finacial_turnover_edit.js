/**
 * Created by user on 2016/10/14.
 */
var turnover=(function($,tor){
    var turnover=tor;

    Number.prototype.formatMoney = function(c, d, t){
        var n = this,
            c = isNaN(c = Math.abs(c)) ? 2 : c,
            d = d == undefined ? "." : d,
            t = t == undefined ? "," : t,
            s = n < 0 ? "-" : "",
            i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
            j = (j = i.length) > 3 ? j % 3 : 0;
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    };

  /*  console.log((123456789.12345).formatMoney(2, '.', ','));
    console.log((123456789).formatMoney(2, '.', ','));*/

    //检查非负浮点数
    function checkNum(num){
        var patt=/^\d+(\.\d+)?$/g;
        return patt.test(num);
    }

    turnover.numberFormat=function(num){
        return parseFloat(num).formatMoney(2, '.', ',');
    };

    //按照月份创建table 并填充数据
    //判断当前年份是否是闰年(闰年2月份有29天，平年2月份只有28天)
    function isLeap(year) {
        return year % 4 == 0 ? (year % 100 != 0 ? 1 : (year % 400 == 0 ? 1 : 0)) : 0;
    }
    turnover.createTabelRows=function(cdate,data_obj){
        var date_table_rows=[];

        var i, k,
            curDate =(typeof cdate==="undefined")?(new Date()):cdate,                 //获取当前日期
            y = curDate.getFullYear(),              //获取日期中的年份
            m = curDate.getMonth(),                //获取日期中的月份(需要注意的是：月份是从0开始计算，获取的值比正常月份的值少1)
            d = new Date().getDate(),                //获取日期中的日(方便在建立日期表格时高亮显示当天)
            firstday = new Date(y, m, 1),            //获取当月的第一天
            dayOfWeek = firstday.getDay(),           //判断第一天是星期几(返回[0-6]中的一个，0代表星期天，1代表星期一，以此类推)
            days_per_month = new Array(31, 28 + isLeap(y), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31),         //创建月份数组
            str_nums = Math.ceil((dayOfWeek + days_per_month[m]) / 7);                        //确定日期表格所需的行数

        for (i = 0; i < str_nums; i += 1) {         //二维数组创建日期表格
            var row='';
            row+=('<tr>');
            for (k = 0; k < 7; k++) {
                var idx = 7 * i + k;                //为每个表格创建索引,从0开始
                var date = idx - dayOfWeek + 1;          //将当月的1号与星期进行匹配
                //索引小于等于0或者大于月份最大值就用空表格代替
                if(date <= 0 || date > days_per_month[m]){
                    row+='<td></td>';
                }else{
                    var iftoday=date==d?'today':'';
                    date=date<9?("0"+date):date;
                    var data_date=y+"-"+(m+1)+"-"+date;
                    var value=(typeof data_obj[data_date]==="undefined")?"":data_obj[data_date];
                    var formatValue=(typeof data_obj[data_date]==="undefined")?"/":turnover.numberFormat(value);

                    var row_array=[
                        '<td class="'+ iftoday+'">',
                            '<span>'+date+'</span>',
                            '<div class="td-input-wrapper">',
                                '<input type="text" placeholder="/"  data-date="'+data_date +'" value="'+value+'"/>',
                                '<span class="number-format">'+formatValue+'</span>',
                            '</div>',
                        '</td>'
                    ];
                    row+=row_array.join("");
                }
            }
            row+=('</tr>');
            date_table_rows.push(row);
        }

        return date_table_rows;
    };

    turnover.getTabel_data=function(id,date){
        //ajax here
        var data_obj={
            "totalMoney": "922.00",
            "2016-10-01": "333.88",
            "2016-10-10": "333.88",
            "2016-10-09": "444.55",
            "2016-10-31": "777788.66666"
        };
        //callback
        var tableRows=turnover.createTabelRows(date,data_obj);
        //
        return tableRows;
    };
    turnover.createTabel=function($table,id,date){
        turnover.show_loading();

       var tableRows=turnover.getTabel_data(id,date).join("");
       $table.append(tableRows);
        turnover.hide_loading();
    };
    turnover.getMonthly_data=function(id,date){
        //ajax here

        var data_obj={
            "totalMoney": "922.00",
            "2016-09": "333.88",
            "2016-10": "777.66",
            "2016-12": "55555.88"
        };
        //callback
        return data_obj;
    };
    turnover.createMonthlyTable=function($table,id,year){
        turnover.show_loading();

        var data_obj=turnover.getMonthly_data(id,year);

        //$table
        $table.find(".td-monthly-count").each(function(i,e){
            var index=year+"-"+$(e).data("month");

            if(typeof data_obj[index] ==="undefined"){
                $(this).find("span").text("/");
            }else{
                $(this).find("span").text(turnover.numberFormat(data_obj[index]));
            }
        });

        turnover.hide_loading();

    };
    //date function
    //var start_date1="2015-01-01";
    function gd(year, month, day) {
        return new Date(year, month, day).getTime();
    }

    function DateAdd(interval,number,dateStr)
    {
        /*
         *   功能:实现VBScript的DateAdd功能.
         *   参数:interval,字符串表达式，表示要添加的时间间隔.
         *   参数:number,数值表达式，表示要添加的时间间隔的个数.
         *   参数:dateStr,字符类型格式2015-01-01.
         *   返回:新的时间对象.
         *   var   now   =   new   Date();
         *   var   newDate   =   DateAdd( "d ",5,now);
         *---------------   DateAdd(interval,number,date)   -----------------
         */
        var date = new Date(dateStr);
        var dateStr="";
        switch(interval)
        {
            case   "y"   :   {
                date.setFullYear(date.getFullYear()+number);
                //break;
                dateStr+=date.getFullYear();
                break;
            }
            case   "q"   :   {
                date.setMonth(date.getMonth()+number*3);
                break;
            }
            case   "m"   :   {
                date.setMonth(date.getMonth()+number);
                //break;
                dateStr= date.getFullYear()+"-"+(date.getMonth()<9?("0"+(date.getMonth()+1)):(date.getMonth()+1));
            }
            case   "w"   :   {
                date.setDate(date.getDate()+number*7);
                break;
            }
            case   "d"   :   {
                date.setDate(date.getDate()+number);
                dateStr= date.getFullYear()+"-"+(date.getMonth()<9?("0"+(date.getMonth()+1)):(date.getMonth()+1))+"-"+(date.getDate()<9?("0"+date.getDate()):date.getDate());
                break;
            }
            case   "h"   :   {
                date.setHours(date.getHours()+number);
                break;
            }
            case   "mi"   :   {
                date.setMinutes(date.getMinutes()+number);
                break;
            }
            case   "s"   :   {
                date.setSeconds(date.getSeconds()+number);
                break;
            }
            default   :   {
                date.setDate(date.getDate()+number);
                dateStr= date.getFullYear()+"-"+(date.getMonth()<9?("0"+(date.getMonth()+1)):(date.getMonth()+1))+"-"+(date.getDate()<9?("0"+date.getDate()):date.getDate());
                break;
            }
        }

        return dateStr;

    }
    turnover.datePickerInit=function(){
        var date_default=new Date();
        var date_default_year=date_default.getFullYear();
        var date_default_month=date_default.getMonth()<9?("0"+(date_default.getMonth()+1)):(date_default.getMonth()+1);

        $(".ys-datepicker input").val(date_default_year+"-"+date_default_month).data("month",date_default_month).datetimepicker({
            format:"yyyy-mm",
            todayBtn:"linked",
            startView:3,
            minView:3,
            autoclose:true,
            language: 'zh-CN'
        });

      /*  $(".ys-datepicker input").datetimepicker().on('changeMonth', function(e){
            //e.date e.timeStamp
            var select_date=new Date(e.date);
            $(this).data("month",select_date.getMonth()+1);
            console.log($(this).data("month"));
        });

        $(".ys-datepicker input").datetimepicker().on('changeYear', function(e){
            //e.date e.timeStamp
            var select_date=new Date(e.date);
        });*/
        $(".ys-datepicker input").on("change",function(e){
            var curDate=$(this).val();
            //顶部整体日期切换
            console.log($(this).closest(".ys-datepicker").attr("id"));
            if($(this).closest(".ys-datepicker").attr("id")=="datepicker"){
                //relocate
                var url=location.host+location.pathname+"?date="+curDate;
                console.log(url);
            }else{
                var $collapse=$(this).closest(".panel-collapse");
                var $table=$collapse.find(".table-turnover-input tbody");
                $table.empty();
                var id=$collapse.data("id");
                 //如果collapse日期值为空，则取 #datepicker的值
                 var dateVal=$collapse.find(".ys-datepicker input").val().split("-");
                 var date=new Date(dateVal[0],dateVal[1]-1,1);
                 turnover.createTabel($table,id,date);
            }
        });

        $(".ys-datepicker").on("click","button",function(e){
            e.preventDefault();
            if($(this).closest(".ys-datepicker").hasClass("disabled")){
                return;
            }
            var curButton=$(this).data("date");
            var plus=1;
            if(curButton=="pre"){
                plus=-1;
            }
            var dateStr=$(this).closest(".ys-datepicker").find("input").val();
            if(dateStr==""){
                var today=new Date();
                var newDate=DateAdd("m",plus,today);
                $(this).closest(".ys-datepicker").find("input").val(newDate);
            }else{
                var curDateStr= dateStr.split("-");
                var curDate=gd(parseInt(curDateStr[0]),parseInt(curDateStr[1]||1)-1,parseInt(curDateStr[2]||1));
                var newDate=DateAdd("m",plus,curDate);
                $(this).closest(".ys-datepicker").find("input").val(newDate).trigger("change");
            }
        });
    };
    turnover.collapseInit=function(){
        /*collapse收缩展开时处理*/
        $('.panel-collapse').on('shown.bs.collapse', function (e) {
            // do something…
            $(this).closest(".panel").addClass("ys-collapse-in");

            var $table=$(this).find(".table-turnover-input tbody");

            if($table.html().trim()==""){
                var id=$(this).data("id");
                //如果collapse日期值为空，则取 #datepicker的值
                var dateVal=$(this).find(".ys-datepicker input").val().split("-");

                var date=new Date(dateVal[0],dateVal[1]-1,1);

                turnover.createTabel($table,id,date);
            }
        });
        $('.panel-collapse').on('hidden.bs.collapse', function (e) {
            // do something…
            $(this).closest(".panel").removeClass("ys-collapse-in");
        });

        $(".ys-btn-close").on("click",function(e){
            e.preventDefault();
            $(this).closest(".panel-collapse").collapse('hide')
        });

        $(".ys-btn-save").on("click",function(e){
            e.preventDefault();

            var $elm=$(this).closest(".panel-collapse");
             turnover.submit_item($elm);
            //$(this).closest(".panel-collapse").collapse('hide');
        });
    };

    turnover.pageInit=function(){
        $("#ys-adv-search-btn").on("click",function(e){
            $(".adv-search-wrapper").slideToggle("fast");
        });
    };

    turnover.td_edit_init=function(){
      $(".ys-turnover-panel-edit").on("click","td",function(){
            $(".ys-turnover-panel-edit td").removeClass("active");
            $(this).addClass("active");
      });

      $(".ys-turnover-panel-edit").on("change","input",function(e){
          var val=($(this).val());
          var oldVal=$(this).next("span").text();
          //如果当前值有变化，在当前td加修改标记
          if(checkNum(val)){
              if(turnover.numberFormat(val)!=oldVal){
                  $(this).closest("td").removeClass("error").addClass("change");
                  $(this).next("span").text(turnover.numberFormat(val))
              }
          }else{
              $(this).closest("td").addClass("error");
              $(this).next("span").text(val);
          }
      })
    };

    turnover.show_loading=function(){
        $("html").css({ "overflow":'hidden' });
        $("body").css({ "overflow":'hidden' });
        $(".loading").fadeIn();
    };
    turnover.hide_loading=function(){
        $("html").css({ "overflow":'inherit' });
        $("body").css({ "overflow":'auto' });
        $(".loading").fadeOut();
    };

    turnover.dateRange_init =function(){
        $(".btn-turnover-daterange").on("click",function(e){
            e.preventDefault();
            if($(this).hasClass("active")){
                return;
            }else{
                $(this).closest(".btn-group").find(".btn-turnover-daterange").removeClass("active");
                $(this).addClass("active");
                var type=$(this).data("range");
                var $wrapper=$(this).closest(".panel-collapse");

                var id=$(this).closest(".panel-collapse").data("id");

                var date=$(this).closest(".panel-collapse").find(".ys-datepicker input").val();//date_month
                if(type==="month"){
                    $wrapper.find(".ys-turnover-year").hide().end().find(".ys-turnover-panel-edit").fadeIn();
                    $(this).closest(".panel-collapse").find(".ys-datepicker").removeClass("disabled").find("input").removeAttr("disabled");
                   /* $(this).closest(".panel-collapse").find(".ys-datepicker input").datetimepicker("remove").val(date).datetimepicker({
                        format:"yyyy-mm",
                        todayBtn:"linked",
                        startView:3,
                        minView:3,
                        autoclose:true,
                        language: 'zh-CN'
                    });*/
                }else if(type==="year"){
                    var year=date.split("-")[0];
                    $(this).closest(".panel-collapse").find(".ys-datepicker").addClass("disabled").find("input").attr("disabled",'true');
                   /* console.log($(this).closest(".panel-collapse").find(".ys-datepicker input"));
                    $(this).closest(".panel-collapse").find(".ys-datepicker input").datetimepicker("remove").val(year).datetimepicker({
                        format:"yyyy",
                        todayBtn:"linked",
                        startView:4,
                        minView:4,
                        autoclose:true,
                        language: 'zh-CN'
                    });*/
                    turnover.createMonthlyTable($wrapper.find(".table-turnover-yearly"),id,year);
                    $wrapper.find(".ys-turnover-panel-edit").hide().end().find(".ys-turnover-year").fadeIn();

                }
            }
        });
    };

    function getSummary($elm){
        //
    };
    turnover.submit_item=function($elm){
        console.log($elm);
        if($elm.find(".error").length==0){
            var id=$elm.data("id");
            var datas={};
            if($elm.find(".change").length==0){
                alert("没有做任何修改！");
                return;
            }else{
                turnover.show_loading();
                $elm.find(".change input").each(function(i,e){
                    if($(this).val()!==""){
                        datas[$(this).data("date")]=parseFloat($(this).val()).toFixed(2);
                    }
                });
                var json_data={
                    "id":id,
                    "darray":datas
                };
                //ajax here;
                console.log(json_data);
                //callback
                //合计 和营业额合计 是取历史总数据，需要后台计算后回传，也写在回调里
                //var sum=1234567890 以下方法写在ajax回掉里
                    var sum=1234567890;
                    $elm.find("td").removeClass("change");
                    $elm.find(".turnover-item-sum i").text(turnover.numberFormat(sum));
                    $elm.closest(".panel").find("li.turnover-all").text(turnover.numberFormat(sum));
                    turnover.hide_loading();

            }
        }else{
            alert("请修正页面错误数据!")
        }
    };

    turnover.search_init=function(){
      //relocate

    };

    turnover.init=function(){
        turnover.td_edit_init();
        turnover.datePickerInit();
        turnover.collapseInit();
        turnover.dateRange_init();
        turnover.pageInit();
    };

    return turnover;
})(jQuery,turnover||{});