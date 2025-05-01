import { render } from '@czechitas/render';
import { ShopItem } from '../components/ShopItem';
import '../global.css';
import './index.css';

// TODO nezapomeňte nastavit svůj login – jednoznačný identifikátor (třeba název účtu na GitHubu)
//const login = ""

const login = 'katka.katka';

const response = await fetch('https://nakupy.czechitas.dev/api/mon', {
  headers: {
    Authorization: login,
  },
});
const list = await response.json();
console.log(list);

const HomePage = () => (
  <>
    <div className="banner"></div>
    <div className="container">
      <form className="newitem-form">
        <label htmlFor="input-name">Položka</label>
        <input id="input-name" type="text" />
        <label htmlFor="input-amount">Množství</label>
        <input id="input-amount" type="text" />
        <label htmlFor="input-unit">Jednotka</label>
        <input id="input-unit" type="text" />
        <button className="btn-add">Přidat</button>
      </form>
      <div className="shoplist">
        {list.map((item) => (
          <ShopItem
            id={item.id}
            key={item.id}
            name={item.product}
            amount={item.amount + ' ' + item.unit}
            bought={item.done}
          />
        ))}
      </div>
    </div>
  </>
);

document.querySelector('#root').innerHTML = render(<HomePage />);

document
  .querySelector('.newitem-form')
  .addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.querySelector('#input-name');
    const amountInput = document.querySelector('#input-amount');
    const unitInput = document.querySelector('#input-unit');

    const body = {
      product: nameInput.value,
      amount: Number(amountInput.value),
      unit: unitInput.value,
      done: false,
    };

    await fetch('https://nakupy.czechitas.dev/api/mon', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: login,
      },
      body: JSON.stringify(body),
    });

    window.location.reload();
  });

const handleDelete = document.querySelectorAll('.btn-delete');
handleDelete.forEach((button) => {
  button.addEventListener('click', async (event) => {
    const id = button.dataset.id;
    console.log('id', id);
    const response = await fetch(`https://nakupy.czechitas.dev/api/mon/${id}`, {
      method: 'DELETE',
    });
    window.location.reload();
  });
});
