// Firebase Configuração
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMa3_Wu8CEGHyE8C9tYr0p2vG1lLN6MeE",
  authDomain: "lojaallice.firebaseapp.com",
  projectId: "lojaallice",
  storageBucket: "lojaallice.firebasestorage.app",
  messagingSenderId: "486050182727",
  appId: "1:486050182727:web:5223d7b29d18246af86362",
  measurementId: "G-EK3W7TJGFQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Dados Locais
let clients = [];
let products = [];
let currentOrder = [];
let orderTotal = 0;

// Cadastro de Clientes
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
    clients.forEach((client) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${client.name}</strong><br>
                        <img src="${client.photoURL}" alt="Foto do cliente" width="100">`;
        clientList.appendChild(li);
    });
}

// Cadastro de Produtos
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
    products.forEach((product) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${product.name}</strong><br>Preço: R$${product.price.toFixed(2)}<br>
                        Código: ${product.barcode}<br>
                        <img src="${product.photoURL}" alt="Foto do produto" width="100">`;
        productList.appendChild(li);
    });
}

// Lançar Pedido
document.getElementById("scanBarcode").addEventListener("click", () => {
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector("body"),
        },
        decoder: { readers: ["ean_reader"] },
    }, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        Quagga.start();
    });

    Quagga.onDetected((result) => {
        const barcode = result.codeResult.code;
        const product = products.find((p) => p.barcode === barcode);

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
    currentOrder.forEach((product) => {
        const li = document.createElement("li");
        li.textContent = `${product.name} - R$${product.price.toFixed(2)}`;
        orderList.appendChild(li);
    });
    document.getElementById("orderTotal").textContent = orderTotal.toFixed(2);
}

// Salvar Dados no Firebase
function saveToFirebase() {
    firebase.database().ref("appData").set({
        clients,
        products,
        currentOrder,
    }, (error) => {
        if (error) {
            alert("Erro ao salvar no Firebase.");
        } else {
            alert("Dados salvos com sucesso!");
        }
    });
}

// Carregar Dados do Firebase
function loadFromFirebase() {
    firebase.database().ref("appData").once("value").then((snapshot) => {
        const data = snapshot.val();
        if (data) {
            clients = data.clients || [];
            products = data.products || [];
            currentOrder = data.currentOrder || [];
            updateClientList();
            updateProductList();
            updateOrderList();
        } else {
            alert("Nenhum dado encontrado no Firebase.");
        }
    }).catch((error) => {
        console.error("Erro ao carregar dados:", error);
    });
}
