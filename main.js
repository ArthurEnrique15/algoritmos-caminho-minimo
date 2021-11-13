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
      switch(algorithmUsed) {
        case "D":
          dijkstra(fileReader.result, origin, destination);
          break;
        // case "B":
        //   bellmanFord(fileReader.result, origin, destination);
        //   break;
        // case "F":
        //   floydWarshall(fileReader.result, origin, destination);
        //   break;
      }
    }

    fileReader.readAsText(fileTobeRead);
  
  } else {
    alert("Selecione um arquivo de texto!");
    return;
  }
}

function dijkstra(graph, origin, destination) {
  // verificar se a origem e destino são validos
  // preencher dist e pred com infinito e null
  // procurar o caminho mínimo
  graphArray1 = graph.replace(" ", ",");



  graphArray = graph.split(" ");
  console.log(graphArray1);
  
  totalVertices = graph.split(" ", 1)[0];

  if (origin < 0 || origin > totalVertices-1 || destination < 0 || destination > totalVertices-1) {
    alert("Origem ou destino inválido!");
    return;
  }

  // console.log(graph);
  // console.log(origin);
  // console.log(destination);
}