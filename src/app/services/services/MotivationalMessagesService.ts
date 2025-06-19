import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MotivationalMessagesService {
  private motivationalMessages: { quote: string, author: string }[] = [
    { quote: 'A arquitetura é o jogo sábio, correto e magnífico dos volumes sob a luz.', author: 'Le Corbusier' },
    { quote: 'Um edifício tem duas vidas. A que imagina e a que tem. E nem sempre elas coincidem.', author: 'Rem Koolhaas' },
    { quote: 'Menos é mais.', author: 'Ludwig Mies van der Rohe' },
    { quote: 'A forma segue a função.', author: 'Louis Sullivan' },
    { quote: 'Construímos edifícios, e depois eles nos constroem.', author: 'Winston Churchill' },
    { quote: 'Não é o ângulo reto que me atrai, mas a curva livre e sensual.', author: 'Oscar Niemeyer' },
    { quote: 'O engenheiro é aquele que transforma ideias em realidade concreta.', author: 'Henry Petroski' },
    { quote: 'A arquitetura começa onde termina a engenharia.', author: 'Walter Gropius' },
    { quote: 'Design não é apenas o que parece e o que se sente. Design é como funciona.', author: 'Steve Jobs' },
    { quote: 'A verdadeira engenharia começa com um lápis e um papel.', author: 'Isambard Kingdom Brunel' },
    { quote: 'Um bom arquiteto precisa ser um bom poeta.', author: 'Johann Wolfgang von Goethe' },
    { quote: 'Se a arquitetura é música congelada, o engenheiro é o maestro invisível.', author: 'Frank Gehry' },
    { quote: 'A inovação distingue um líder de um seguidor.', author: 'Steve Jobs' },
    { quote: 'A simplicidade é a maior sofisticação.', author: 'Leonardo da Vinci' },
    { quote: 'O bom design é óbvio. O ótimo design é transparente.', author: 'Joe Sparano' },
    { quote: 'A engenharia é a arte de dirigir os grandes recursos da natureza para o benefício do homem.', author: 'Thomas Tredgold' },
    { quote: 'Arquitetura é arte de desperdício criativo de espaço.', author: 'Philip Johnson' },
    { quote: 'A construção é o meio pelo qual a arquitetura se manifesta.', author: 'Renzo Piano' },
    { quote: 'Nenhum grande edifício foi construído sem desafios.', author: 'Norman Foster' },
    { quote: 'O engenheiro vive para resolver problemas.', author: 'Elon Musk' },
    { quote: 'Arquitetura deve falar de seu tempo e lugar, mas aspirar à atemporalidade.', author: 'Frank Gehry' },
    { quote: 'O futuro pertence àqueles que constroem com inteligência.', author: 'Buckminster Fuller' },
    { quote: 'Você não pode construir uma reputação com base no que você vai fazer.', author: 'Henry Ford' },
    { quote: 'Quando você quer construir algo grande, comece com uma base sólida.', author: 'Elena Manferdini' },
    { quote: 'A construção é a interseção entre arte e ciência.', author: 'Santiago Calatrava' },
    { quote: 'Um engenheiro nunca para de aprender.', author: 'Emily Warren Roebling' },
    { quote: 'A boa arquitetura é aquela que nos inspira todos os dias.', author: 'Tadao Ando' },
    { quote: 'Problemas são apenas oportunidades esperando para serem resolvidas.', author: 'Charles Kettering' },
    { quote: 'A melhor maneira de prever o futuro é projetá-lo.', author: 'Buckminster Fuller' },
    { quote: 'A forma mais pura de design é resolver o problema certo.', author: 'Paul Rand' },
    { quote: 'A ponte mais difícil de construir é entre o pensamento e a ação.', author: 'Antoine Picon' },
    { quote: 'A engenharia cria as fundações para que a arquitetura sonhe alto.', author: 'Zaha Hadid' },
    { quote: 'É nos detalhes que mora a perfeição.', author: 'Ludwig Mies van der Rohe' },
    { quote: 'Todo edifício conta uma história – o arquiteto é seu autor.', author: 'Daniel Libeskind' },
    { quote: 'A estrutura é o esqueleto invisível da beleza.', author: 'Carlo Scarpa' },
    { quote: 'Seja ousado, mas respeite a técnica.', author: 'Oscar Niemeyer' },
    { quote: 'Desafie o impossível, com cálculo preciso.', author: 'Fazlur Rahman Khan' },
    { quote: 'Não construa apenas paredes, construa significados.', author: 'Peter Zumthor' },
    { quote: 'Projetar é uma forma de transformar sonhos em matéria.', author: 'Álvaro Siza Vieira' },
    { quote: 'Arquitetos desenham ideias. Engenheiros constroem possibilidades.', author: 'Anônimo' }
  ];

  constructor() {}

  getRandomMessage(): { quote: string, author: string } {
    const randomIndex = Math.floor(Math.random() * this.motivationalMessages.length);
    return this.motivationalMessages[randomIndex];
  }

  getAllMessages(): { quote: string, author: string }[] {
    return this.motivationalMessages;
  }
}