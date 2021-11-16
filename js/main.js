function load() {
    $("#input").show();
    $("#output").hide();
}

function execute() {
    let algorithmUsed;
    if ($("#algorithmD").prop("checked")) {
        algorithmUsed = $('#algorithmD').val();
    } else if ($("#algorithmB").prop("checked")) {
        algorithmUsed = $('#algorithmB').val();
    } else if ($("#algorithmF").prop("checked")) {
        algorithmUsed = $('#algorithmF').val();
    } else {
        alert("Selecione um algoritmo!");
        return;
    }

    const origin = $('#origin').val();
    const destination = $('#destination').val();

    if (!origin || !destination) {
        alert("Digite um vértice de origem e de destino!");
        return;
    }

    var fileSelected = document.getElementById('graphFile');

    //Get the file object
    var fileTobeRead = fileSelected.files[0];

    if (!fileTobeRead) {
        alert("Selecione um arquivo!");
        return;
    }

    //Set the extension for the file
    var fileExtension = /text.plain/;

    //Check of the extension match
    if (fileTobeRead.type.match(fileExtension)) {

        //Initialize the FileReader object to read the 2file
        var fileReader = new FileReader();

        fileReader.onload = function (e) {
            switch (algorithmUsed) {
                case "D":
                    dijkstra(fileReader.result, origin, destination);
                    break;
                case "B":
                    bellmanFord(fileReader.result, origin, destination);
                    break;
                case "F":
                    floydWarshall(fileReader.result, origin, destination);
                    break;
            }
        }

        fileReader.readAsText(fileTobeRead);

    } else {
        alert("Selecione um arquivo de texto!");
        return;
    }
}

function dijkstra(graph, origin, destination) {
    const startTime = new Date().getTime();
  
    origin = parseInt(origin);
    destination = parseInt(destination);
  
    ({ totalVertex, graphArray } = processGraph(graph));
  
    if (!originDestValidation({ origin, destination, totalVertex })) {
        alert("Origem ou destino inválido!");
        return;
    }
  
    // cria os vetores de distância e predecessor e os preenche
    let dist = [];
    let pred = [];
    for (i = 0; i < totalVertex; i++) {
        dist.push(Number.POSITIVE_INFINITY);
        pred.push(null);
    }
  
    dist[origin] = 0;
  
    vertexList = createVertexList(totalVertex);
  
    while (vertexList.length !== 0) {
        // pegar o vertice com menor distância que está presente em vertexList
        let vertexSmallerDistance;
        let smallerDistance = Number.POSITIVE_INFINITY;
        for (i = 0; i < vertexList.length; i++) {
            if (dist[vertexList[i]] < smallerDistance) {
                smallerDistance = dist[vertexList[i]];
                vertexSmallerDistance = vertexList[i];
            }
        }
  
        // remove o vértice de menor distância da lista de vértices
        vertexList.splice(vertexList.indexOf(vertexSmallerDistance), 1);
  
        // pega todos os registros do grafo que representam arestas do vértice de menor distância
        let adjacentVertexArray = graphArray.filter((object) => object.origin === vertexSmallerDistance);
  
        // preenche os vetores dist e pred com as arestas do vértice de menor distância
        for (i = 0; i < adjacentVertexArray.length; i++) {
            let vertex = adjacentVertexArray[i].destination;
            let value = adjacentVertexArray[i].value;
  
            if (dist[vertex] > dist[vertexSmallerDistance] + value) {
                dist[vertex] = dist[vertexSmallerDistance] + value;
                pred[vertex] = vertexSmallerDistance;
            }
        }
    }
  
    // cria o vetor do caminho e a variável de custo
    let path = [];
    let cost = dist[destination];
    path.unshift(destination);
  
    // preenche o caminho
    while (path[0] != origin) {
        path.unshift(pred[path[0]]);
    }
  
    // cálculo do tempo de execução em segundos
    const executionTime = (new Date().getTime() - startTime) / 1000;
  
    exitData({ algorithm: "Dijkstra", path, cost, executionTime });
}

function bellmanFord(graph, origin, destination) {
    const startTime = new Date().getTime();

    origin = parseInt(origin);
    destination = parseInt(destination);
  
    ({ totalVertex, graphArray } = processGraph(graph));
  
    if (!originDestValidation({ origin, destination, totalVertex })) {
        alert("Origem ou destino inválido!");
        return;
    }
  
    // cria os vetores de distância e predecessor e os preenche
    let dist = [];
    let pred = [];
    for (i = 0; i < totalVertex; i++) {
        dist.push(Number.POSITIVE_INFINITY);
        pred.push(null);
    }
  
    dist[origin] = 0;

    for(i = 0; i < totalVertex; i++) {
        change = false;

        for(j = 0; j < graphArray.length; j++) {
            if (dist[graphArray[j].destination] > dist[graphArray[j].origin] + graphArray[j].value) {
                dist[graphArray[j].destination] = dist[graphArray[j].origin] + graphArray[j].value;
                pred[graphArray[j].destination] = graphArray[j].origin;
                change = true;
            }
        }

        if (change == false) {
            break;
        }
    }

    // cria o vetor do caminho e a variável de custo
    let path = [];
    let cost = dist[destination];
    path.unshift(destination);
  
    // preenche o caminho
    while (path[0] != origin) {
        path.unshift(pred[path[0]]);
    }

    // cálculo do tempo de execução em segundos
    const executionTime = (new Date().getTime() - startTime) / 1000;
    // console.log(executionTime, " segundos");
  
    exitData({ algorithm: "Bellman-Ford", path, cost, executionTime });
}

function floydWarshall(graph, origin, destination) {
    const startTime = new Date().getTime();
  
    origin = parseInt(origin);
    destination = parseInt(destination);
  
    ({ totalVertex, graphArray } = processGraph(graph));
  
    if (!originDestValidation({ origin, destination, totalVertex })) {
        alert("Origem ou destino inválido!");
        return;
    }

    // console.log(graphArray);

    let dist = [];
    let pred = [];
    for (i = 0; i < totalVertex; i++) {
        dist.push([]);
        pred.push([]);
    }

    for (i = 0; i < totalVertex; i++) {
        for (j = 0; j < totalVertex; j++) {
            if (i == j) {
                dist[i][j] = 0;
                pred[i][j] = null;
            } else {
                element = graphArray.find((element) => element.origin == i && element.destination == j);
                // console.log(i, j, element);
                if (element) {
                    dist[i][j] = element.value;
                    pred[i][j] = i;
                } else {
                    dist[i][j] = Number.POSITIVE_INFINITY;
                    pred[i][j] = null;
                }
            }
        }
    }

    for (k = 0; k < totalVertex; k++) {
        for (i = 0; i < totalVertex; i++) {
            for (j = 0; j <= totalVertex; j++) {
                if (dist[i][j] > dist[i][k] + dist[k][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                    pred[i][j] = pred[k][j];
                }
            }
        }   
    }

    // console.log(dist, pred);

    // cria o vetor do caminho e a variável de custo
    let path = [];
    let cost = dist[origin][destination];
    path.unshift(destination);
  
    // preenche o caminho
    while (path[0] != origin) {
        path.unshift(pred[origin][path[0]]);
    }

    // console.log(path, cost);

    // cálculo do tempo de execução em segundos
    const executionTime = (new Date().getTime() - startTime) / 1000;
    // console.log(executionTime, " segundos");
  
    exitData({ algorithm: "Floyd Warshall", path, cost, executionTime });
}

function processGraph(graph) {
    // separa a string em todos os espaços e quebras de linha
    incompleteGraphArray = graph.split(/ |\r\n|\n/);

    // remove os dois primeiros números do array, e pega apenas o primeiro (total de vértices)
    totalVertex = incompleteGraphArray.splice(0, 2)[0];

    const graphArray = [];

    // preenche o array com objetos que possuem os atributos origin, destination e value
    for (i = 0; i < incompleteGraphArray.length; i += 3) {
        graphArray.push({
            origin: parseInt(incompleteGraphArray[i]),
            destination: parseInt(incompleteGraphArray[i + 1]),
            value: parseInt(incompleteGraphArray[i + 2]),
        })
    }

    const data = {
        totalVertex,
        graphArray
    }

    return data;
}

function originDestValidation({ origin, destination, totalVertex }) {
    if (
        origin < 0 ||
        origin > totalVertex - 1 ||
        destination < 0 ||
        destination > totalVertex - 1 ||
        origin === destination) {
        return false;
    }
    return true
}

function createVertexList(totalVertex) {
    const vertexList = []
    for (i = 0; i < totalVertex; i++)
        vertexList.push(i);

    return vertexList;
}

function exitData({ algorithm, path, cost, executionTime }) {
    $("#output").show();
    $("#input").hide();

    let algorithmDocument = document.getElementById('algorithm');
    algorithmDocument.innerText = algorithm;

    let fileName = document.getElementById('graphFile').files[0].name;

    let fileNameDocument = document.getElementById('file');
    fileNameDocument.innerText = fileName;

    let stringPath = path.toString();
    stringPath = "[ " + stringPath + " ]";
    stringPath = stringPath.replace(/,/g, ", ");

    let pathDocument = document.getElementById('path');
    pathDocument.innerText = stringPath;

    let costDocument = document.getElementById('cost');
    costDocument.innerText = cost;

    let executionTimeDocument = document.getElementById('executionTime');
    executionTimeDocument.innerText = executionTime + " segundos";
}