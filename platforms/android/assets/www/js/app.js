var app = app || {};

(function(scope){
	scope.init = function(){
		document.addEventListener('deviceready', scope.onDeviceReady, false);
	};

	scope.onDeviceReady = function() {
       scope.checkConnection();
       $('.login').on('click','.js-login' ,scope.validateLogin);
       nfc.addTagDiscoveredListener(scope.readNFC, scope.NFCsucesso, scope.NFCerror);
    };
    scope.checkConnection = function () {
            var networkState = navigator.connection.type;
            var states = {};
            states[Connection.UNKNOWN]  = 'Unknown connection';
            states[Connection.ETHERNET] = 'Ethernet connection';
            states[Connection.WIFI]     = 'WiFi connection';
            states[Connection.CELL_2G]  = 'Cell 2G connection';
            states[Connection.CELL_3G]  = 'Cell 3G connection';
            states[Connection.CELL_4G]  = 'Cell 4G connection';
            states[Connection.CELL]     = 'Cell generic connection';
            states[Connection.NONE]     = 'No network connection';
            if (states[networkState] == states[Connection.NONE] || states[networkState] == states[Connection.UNKNOWN]){
                alert("Para usar o app é preciso conexão");
            }
        };
    scope.validateLogin = function (){
        var login = document.querySelector(".js-login-name").value;
        var senha = md5(document.querySelector(".js-senha").value);
        $.ajax({
            url: 'http://smartbraselet.com.br:85/webservice/login',
            type: 'GET',
            data: 'login='+ login + '&senha=' + senha,
            dataType : "json",
            success: function (json){
                if (json['total'] > 0){
                    app.config.idfuncionario = json['idFuncionario'];
                    window.sessionStorage.setItem('idfuncionario', app.config.idfuncionario);
                    $('.content-login').removeClass('bounceInDown page-show').addClass('bounceOutDown page-hidden');
                    $('.home').removeClass('page-hidden').addClass('animated bounceInDown');
                }
                else {
                    alert("O usuário ou a senha estão incorretos! ");
                }
            },
            error : function(){
                scope.checkConnection();
            }
        });

    };
    scope.readNFC = function(nfcEvent){
        if(app.config.idfuncionario != undefined){
            var htmlspan = $('.home').html();
            var id = JSON.stringify(nfcEvent.tag['id']);
            id = id.replace(/\,\-/g,'');
            id = id.replace(/\-/g,'');
            id = id.replace(/\,/g,'');
            id = id.replace(/\[/g,'');
            id = id.replace(/\]/g,'');
            $.ajax({
                url: 'http://smartbraselet.com.br:85/webservice/tag',
                type: 'POST',
                data: 'tag='+ id + '&id_funcionario=' + app.config.idfuncionario,
                dataType : "text",
                success: function (json){
                    $('.home').html('<span>Tag pega com sucesso.</span>');
                    setTimeout(function(){
                        $('.home').html(htmlspan);
                    }, 2000);
                },
                error : function(){
                    alert('error');
                    scope.checkConnection();
                }
            });
            
        }
    };
    scope.NFCsucesso = function(){
       
    };
    scope.NFCerror = function(e){
        if (e == "NFC_DISABLED")
            alert("Ative o nfc");
    };
})(app);