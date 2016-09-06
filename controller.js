var app = angular.module("concurso", ['ngMaterial']).value("estados", estados)


app.controller("concursoCtrl", function ($scope, estados) {

    var self = this;

    self.estados = estados;

    self.estado;
    self.cidades;

    $scope.pegaCidade = function () {
        console.log(self.estado)
        if (self.estado == undefined)
            return "Estado"
        else {
            self.estados.forEach(function (item, index) {
                if (item.nome === self.estado)
                    self.cidades = item.cidades;
            })


            return self.estado
        }

    }



});