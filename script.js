// Arrays para armazenar dados
let clients = [];
let products = [];
let currentOrder = [];
let orderTotal = 0;

// Cadastro de clientes
document.getElementById("clientForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("clientName").value;
    const photo = document.getElementById("clientPhoto").files[0];

    const client = { name, photoURL: URL.createObjectURL(photo) };
    clients.push(client);
    updateClientList();
    e.target.reset();
});

function updateClientList() {
    const clientList = document.getElementById("clientList");
    clientList.innerHTML = "";
    clients.forEach((client, index) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${client.name}</strong><br>
                        <img src="${client.photoURL}" alt="Foto do cliente" width="100">`;
        clientList.appendChild(li);
    });
}

// Cadastro de produtos
document.getElementById("productForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("productName").value;
    const price = parseFloat(document.getElementById("productPrice").value);
    const barcode = document.getElementById("productBarcode").value;
    const photo = document.getElementById("productPhoto").files[0];

    const product = { name, price, barcode, photoURL: URL.createObjectURL(photo) };
    products.push(product);
    updateProductList();
    e.target.reset();
});

function updateProductList() {
    const productList = document.getElementById("productList");
    productList.innerHTML = "";
    products.forEach((product, index) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${product.name}</strong><br>Preço: R$${product.price.toFixed(2)}<br>
                        Código: ${product.barcode}<br>
                        <img src="${product.photoURL}" alt="Foto do produto" width="100">`;
        productList.appendChild(li);
    });
}

// Lançamento de pedidos
document.getElementById("scanBarcode").addEventListener("click", () => {
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector("body") // Usando a câmera
        },
        decoder: {
            readers: ["ean_reader"] // Leitura de código de barras EAN
        }
    }, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        Quagga.start();
    });

    Quagga.onDetected((result) => {
        const barcode = result.codeResult.code;
        const product = products.find(p => p.barcode === barcode);

        if (product) {
            currentOrder.push(product);
            orderTotal += product.price;
            updateOrderList();
        } else {
            alert("Produto não encontrado!");
        }
        Quagga.stop();
    });
});

function updateOrderList() {
    const orderList = document.getElementById("orderList");
    orderList.innerHTML = "";
    currentOrder.forEach((product, index) => {
        const li = document.createElement("li");
        li.textContent = `${product.name} - R$${product.price.toFixed(2)}`;
        orderList.appendChild(li);
    });
    document.getElementById("orderTotal").textContent = orderTotal.toFixed(2);
}
