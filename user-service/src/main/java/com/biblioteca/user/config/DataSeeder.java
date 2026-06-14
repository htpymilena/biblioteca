package com.biblioteca.user.config;

import com.biblioteca.user.model.*;
import com.biblioteca.user.repository.BookRepository;
import com.biblioteca.user.repository.LoanRepository;
import com.biblioteca.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final LoanRepository loanRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        try {
            seedUsers();
            seedBooks();
            seedLoans();
        } catch (Exception e) {
            log.error("Error running user-service DataSeeder: ", e);
        }
    }

    private void seedUsers() {
        String[][] usersData = {
            {"Milena", "milena@gmail.com", "Milena@123", "ADMIN"},
            {"Adam", "adam@gmail.com", "Adam@123", "LIBRARIAN"},
            {"Gabriel", "gabriel@gmail.com", "Gabriel@123", "USER"},
            {"Pedro Alvares Cabral", "pedro@gmail.com", "Pedro@123", "USER"},
            {"Dom Joao VI", "domjoao@gmail.com", "Domjoao@123", "USER"},
            {"Princesa Isabel", "isabel@gmail.com", "Isabel@123", "USER"},
            {"Anita Garibaldi", "anita@gmail.com", "Anita@123", "USER"},
            {"Getulio Vargas", "getulio@gmail.com", "Getulio@123", "USER"},
            {"Juscelino Kubitschek", "juscelino@gmail.com", "Juscelino@123", "USER"}
        };

        for (String[] u : usersData) {
            String name = u[0];
            String email = u[1];
            String password = u[2];
            Role role = Role.valueOf(u[3]);

            if (userRepository.findByEmail(email).isEmpty()) {
                try {
                    User user = new User();
                    user.setName(name);
                    user.setEmail(email);
                    user.setPasswordHash(passwordEncoder.encode(password));
                    user.setRole(role);
                    userRepository.saveAndFlush(user);
                    log.info("User seeded in user-service: {}", email);
                } catch (Exception ex) {
                    log.warn("User {} already exists or was seeded concurrently: {}", email, ex.getMessage());
                }
            }
        }
    }

    private void seedBooks() {
        List<Book> booksToSeed = new ArrayList<>();

        booksToSeed.add(createBookHelper("Dom Casmurro", "Machado de Assis", "9788544001813", 1899, "Livraria Garnier", Genre.ROMANCE, 256, 
            "Uma das obras mais famosas da literatura brasileira. O livro é narrado em primeira pessoa por Bento Santiago (Bentinho), que conta a história de seu amor de infância por Capitu e a atormentadora dúvida sobre se ela o traiu com seu melhor amigo, Escobar."));

        booksToSeed.add(createBookHelper("Grande Sertão: Veredas", "João Guimarães Rosa", "9788520938447", 1956, "José Olympio", Genre.FICCAO, 600, 
            "Considerado um dos maiores romances da língua portuguesa. Riobaldo, um ex-jagunço, narra sua vida, suas lutas no sertão mineiro, sua relação com o enigmático Diadorim e as profundas reflexões sobre a existência do diabo e a alma humana."));

        booksToSeed.add(createBookHelper("O Alquimista", "Paulo Coelho", "9788575427583", 1988, "Rocco", Genre.FANTASIA, 172, 
            "A jornada mágica do jovem pastor andaluz Santiago em busca de seu tesouro pessoal no Egito. Uma fábula inspiradora sobre seguir seus sonhos, escutar o próprio coração e ler os sinais que surgem ao longo do caminho da vida."));

        booksToSeed.add(createBookHelper("Memórias Póstumas de Brás Cubas", "Machado de Assis", "9788535914849", 1881, "Typographia Nacional", Genre.ROMANCE, 304, 
            "Um defunto autor narra suas próprias memórias após a morte. Com ironia ácida e pessimismo elegante, Brás Cubas critica a hipocrisia da sociedade carioca do século XIX, expondo suas próprias falhas morais e ambições fracassadas."));

        booksToSeed.add(createBookHelper("Iracema", "José de Alencar", "9788508129035", 1865, "Typographia de Viana & Filhos", Genre.ROMANCE, 160, 
            "Um romance indianista que narra o amor trágico entre Iracema, a virgem dos lábios de mel, e o colonizador português Martim. Uma metáfora lírica sobre a colonização do Ceará e a formação do povo brasileiro."));

        booksToSeed.add(createBookHelper("O Cortiço", "Aluísio Azevedo", "9788508082667", 1890, "B. L. Garnier", Genre.DRAMA, 320, 
            "Exemplo clássico do naturalismo brasileiro. O livro retrata a vida dos moradores de uma estalagem coletiva no Rio de Janeiro, mostrando como o meio social, as paixões humanas e a miséria determinam o comportamento dos indivíduos."));

        booksToSeed.add(createBookHelper("Macunaíma", "Mário de Andrade", "9788577990444", 1928, "Oficina Gráfica Eugênio Cupolo", Genre.FICCAO, 168, 
            "O herói sem nenhum caráter. Uma rapsódia moderna que mistura mitos indígenas, folclore brasileiro e sátira social para criar uma alegoria sobre a identidade cultural do Brasil e a transição do rural para o urbano."));

        booksToSeed.add(createBookHelper("Vidas Secas", "Graciliano Ramos", "9788501115164", 1938, "José Olympio", Genre.DRAMA, 176, 
            "A luta pela sobrevivência de uma família de retirantes no sertão nordestino. Fabiano, Sinhá Vitória, seus filhos e a icônica cachorra Baleia enfrentam a seca implacável, a exploração social e a dificuldade de expressar a própria dor em palavras."));

        booksToSeed.add(createBookHelper("Capitães da Areia", "Jorge Amado", "9788535914061", 1937, "José Olympio", Genre.DRAMA, 280, 
            "A vida de um grupo de meninos abandonados que vivem em um trapiche em Salvador. Liderados por Pedro Bala, os capitães da areia praticam pequenos furtos para sobreviver, enquanto enfrentam a reflexão e injustiça social."));

        booksToSeed.add(createBookHelper("A Hora da Estrela", "Clarice Lispector", "9788532508102", 1977, "José Olympio", Genre.DRAMA, 88, 
            "O último livro publicado em vida por Clarice. O escritor Rodrigo S.M. narra a história da jovem alagoana Macabéa, uma datilógrafa ingênua e invisível que vive no Rio de Janeiro, confrontando o leitor com a miséria existencial."));

        booksToSeed.add(createBookHelper("Sagarana", "João Guimarães Rosa", "9788520938454", 1946, "Universal", Genre.FICCAO, 384, 
            "Coletânea de contos que inaugurou a carreira literária de Guimarães Rosa. Ambientados no sertão de Minas Gerais, os contos exploram a linguagem inovadora, o folclore local, a violência jagunça e a busca por redenção espiritual."));

        booksToSeed.add(createBookHelper("O Tempo e o Vento: O Continente", "Erico Verissimo", "9788535905557", 1949, "Globo", Genre.HISTORIA, 600, 
            "O início da saga monumental do Rio Grande do Sul. O livro narra a formação do estado através da história das famílias Terra e Cambará, com personagens inesquecíveis como Ana Terra e o Capitão Rodrigo Cambará."));

        booksToSeed.add(createBookHelper("Auto da Compadecida", "Ariano Suassuna", "9788501000675", 1955, "Agir", Genre.DRAMA, 208, 
            "Peça teatral que mescla elements da literatura de cordel, barroco e farsa popular. As trapaças de João Grilo e Chicó para enganar os poderosos do vilarejo de Taperoá culminam em um julgamento celestial presidido por Jesus e pela Virgem Maria."));

        booksToSeed.add(createBookHelper("Laços de Família", "Clarice Lispector", "9788532508140", 1960, "Francisco Alves", Genre.ROMANCE, 144, 
            "Coletânea de contos que expõe a hipocrisia e as epifanias silenciosas nas relações cotidianas. Clarice revela o abismo existencial oculto sob as aparências da vida doméstica e familiar da classe média brasileira."));

        booksToSeed.add(createBookHelper("Menino do Engenho", "José Lins do Rego", "9788501091215", 1932, "Adolfo Aizen", Genre.DRAMA, 192, 
            "Obra inaugural do Ciclo da Cana-de-Açúcar. O livro retrata a infância do órfão Carlinhos no engenho do avô materno no Nordeste, documentando o declínio do patriarcalismo rural e o despertar do garoto."));

        booksToSeed.add(createBookHelper("Quincas Borba", "Machado de Assis", "9788535917451", 1891, "Typographia da Gazeta de Noticias", Genre.ROMANCE, 288, 
            "O humilde mestre-escola Rubião herda a fortuna de seu amigo Quincas Borba sob a condição de cuidar de seu cão homônimo. Ao mudar-se para o Rio de Janeiro, Rubião é explorado por aproveitadores até sua completa ruína mental."));

        booksToSeed.add(createBookHelper("O Guarani", "José de Alencar", "9788508139591", 1857, "Diário do Rio de Janeiro", Genre.ROMANCE, 384, 
            "A relação amorosa entre o índio Peri, da tribo dos Goitacases, e a jovem branca Ceci. Uma narrativa épica que retrata o heroísmo indígena, a honra cavalheiresca e o nascimento de uma nova nação mestiça na mata virgem."));

        booksToSeed.add(createBookHelper("Triste Fim de Policarpo Quaresma", "Lima Barreto", "9788577990529", 1911, "Typographia da 'Revista dos Tribunaes'", Genre.FICCAO, 272, 
            "O Major Policarpo Quaresma é um patriota idealista e ingênuo que propõe o tupi-guarani como idioma oficial do Brasil. Suas tentativas de reformar a agricultura e a política nacional resultam em incompreensão e tragédia."));

        booksToSeed.add(createBookHelper("Gabriela, Cravo e Canela", "Jorge Amado", "9788535912449", 1958, "José Olympio", Genre.ROMANCE, 400, 
            "A transformação da cidade de Ilhéus durante o ciclo do cacau nos anos 1920. O amor entre o proprietário de bar Nacib e a retirante sertaneja Gabriela, cuja beleza e liberdade desafiam as rígidas convenções morais da elite local."));

        booksToSeed.add(createBookHelper("Mayombe", "Pepetela", "9788575037591", 1980, "União dos Escritores Angolanos", Genre.HISTORIA, 224, 
            "Narrado sob múltiplos pontos de vista, o romance retrata o cotidiano dos guerrilheiros do MPLA na floresta do Mayombe durante a luta de libertação nacional em Angola, discutindo dilemas éticos, étnicos e políticos."));

        booksToSeed.add(createBookHelper("Urupês", "Monteiro Lobato", "9788525060419", 1918, "Revista do Brasil", Genre.OUTRO, 200, 
            "Coletânea de contos que introduziu a icônica figura do Jeca Tatu, o caboclo acadêmico acometido pela preguiça e pelas doenças do abandono estatal. O livro expressa uma visão realista e melancólica do interior do país."));

        booksToSeed.add(createBookHelper("Primeiras Estórias", "João Guimarães Rosa", "9788520938478", 1962, "José Olympio", Genre.FICCAO, 180, 
            "Coletânea de vinte e um contos marcados por epifanias poéticas e profunda sensibilidade. Entre eles destaca-se 'A terceira margem do rio', a misteriosa história de um pai que decide morar em uma canoa no meio de um rio."));

        booksToSeed.add(createBookHelper("O Ateneu", "Raul Pompeia", "9788508082698", 1888, "Typographia da Gazeta de Noticias", Genre.DRAMA, 240, 
            "Romance impressionista que narra a infância do jovem Sérgio no internato carioca O Ateneu, sob a direção do prepotente Aristarco. O colégio funciona como um microcosmo cruel da sociedade burguesa brasileira."));

        booksToSeed.add(createBookHelper("Quarto de Despejo", "Carolina Maria de Jesus", "9788508170296", 1960, "Francisco Alves", Genre.BIOGRAFIA, 200, 
            "O diário real de uma catadora de papel que vivia na favela do Canindé em São Paulo. O livro relata com linguagem crua e pungente a luta diária contra a fome, o preconceito e as dificuldades de criar seus filhos na extrema pobreza."));

        booksToSeed.add(createBookHelper("Os Sertões", "Euclides da Cunha", "9788508092246", 1902, "Laemmert & C.", Genre.HISTORIA, 650, 
            "Dividido em A Terra, O Homem e A Luta, o livro relata de forma científica e jornalística a Guerra de Canudos e o massacre da comunidade liderada por Antônio Conselheiro pela força militar da recém-fundada República brasileira."));

        booksToSeed.add(createBookHelper("Esaú e Jacob", "Machado de Assis", "9788535917468", 1904, "Typographia da Gazeta de Noticias", Genre.ROMANCE, 288, 
            "A rivalidade irreconciliável entre os irmãos gêmeos Pedro e Paulo no final do Império e início da República. Seus confrontos intelectuais e sentimentais representam a divisão ideológica do próprio Brasil em transição."));

        booksToSeed.add(createBookHelper("A Moreninha", "Joaquim Manuel de Macedo", "9788508119050", 1844, "Typographia de J. E. S. Cabral", Genre.ROMANCE, 192, 
            "Obra fundadora do romantismo brasileiro. A história acompanha a aposta amorosa do jovem estudante de medicina Augusto, que se apaixona pela charmosa e espirituosa Carolina (a Moreninha) durante férias em uma ilha carioca."));

        booksToSeed.add(createBookHelper("Inocência", "Visconde de Taunay", "9788508092307", 1872, "Typographia da Associação Industrial", Genre.ROMANCE, 200, 
            "O trágico amor entre o médico itinerante Cirino e a jovem caipira Inocência, prometida em casamento a outro por seu rígido pai. Um retrato lírico e realista dos costumes patriarcais do sertão do Mato Grosso."));

        booksToSeed.add(createBookHelper("São Bernardo", "Graciliano Ramos", "9788501115157", 1934, "Livraria Schmidt Editora", Genre.DRAMA, 200, 
            "O fazendeiro Paulo Honório narra de forma retrospectiva sua obsessão pelo acúmulo de capital e pela posse da fazenda São Bernardo, cujo ciúme doentio destrói seu casamento com Madalena e resulta em profunda solidão existencial."));

        booksToSeed.add(createBookHelper("Memorial de Aires", "Machado de Assis", "9788535914856", 1908, "Typographia da Gazeta de Noticias", Genre.ROMANCE, 176, 
            "O último romance de Machado. Escrito na forma do diário do Conselheiro Aires, o livro acompanha sua melancólica velhice, suas lembranças diplomáticas e as afeições patrimoniais que desenvolve por um jovem casal de órfãos."));

        booksToSeed.add(createBookHelper("Claro Enigma", "Carlos Drummond de Andrade", "9788535919059", 1951, "José Olympio", Genre.POESIA, 144, 
            "Livro de poemas que marca a maturidade filosófica de Drummond. Abandonando o lirismo ingênuo, o poeta adota uma postura cética, clássica e metafísica diante das dores do mundo pós-guerra e da passagem implacável do tempo."));

        booksToSeed.add(createBookHelper("Morte e Vida Severina", "João Cabral de Melo Neto", "9788579020445", 1955, "José Olympio", Genre.POESIA, 120, 
            "Poema dramático que narra a fuga do retirante Severino da seca do sertão em direção ao Recife. No caminho, ele descobre que a morte é a única companheira constante, até encontrar esperança no nascimento de uma criança."));

        booksToSeed.add(createBookHelper("Poemas Escolhidos", "Gregório de Matos", "9788535916843", 1981, "Companhia das Letras", Genre.POESIA, 220, 
            "Seleção de poesias do 'Boca do Inferno', o maior poeta satírico da literatura colonial brasileira. O autor critica com deboche e talento a sociedade baiana do século XVII, misturando sátira ácida, lirismo amoroso e poesia religiosa."));

        booksToSeed.add(createBookHelper("Sentimento do Mundo", "Carlos Drummond de Andrade", "9788535919066", 1940, "José Olympio", Genre.POESIA, 112, 
            "Um dos livros de poesia mais influentes da literatura brasileira. Escrito sob o impacto da Segunda Guerra Mundial e do Estado Novo, Drummond expressa sua angústia pessoal perante a dor coletiva da humanidade."));

        booksToSeed.add(createBookHelper("Alguma Poesia", "Carlos Drummond de Andrade", "9788535919073", 1930, "Pimenta de Mello", Genre.POESIA, 96, 
            "O livro de estreia de Drummond, contendo poemas célebres como 'Poema de sete faces' e 'No meio do caminho'. A obra consolidou o modernismo brasileiro com uma linguagem irônica, cotidiana e informal."));

        booksToSeed.add(createBookHelper("Broquéis", "Cruz e Sousa", "9788577990666", 1893, "Typographia da 'Folha Popular'", Genre.POESIA, 100, 
            "Obra fundadora do simbolismo brasileiro. Os poemas são marcados pela obsessão pela cor branca, musicalidade enigmática e busca por transcendência espiritual perante a dor material, escrita pelo maior poeta negro do país."));

        booksToSeed.add(createBookHelper("Eu e Outras Poesias", "Augusto dos Anjos", "9788532508157", 1912, "Typographia de J. Valerius", Genre.POESIA, 160, 
            "Único livro publicado pelo enigmático poeta paraibano. Sua poesia mistura termos científicos, angústia metafísica e obsessão pela decomposição da matéria, criando uma obra singular que mescla parnasianismo, simbolismo e pré-modernismo."));

        booksToSeed.add(createBookHelper("Lira dos Vinte Anos", "Álvares de Azevedo", "9788577990413", 1853, "Typographia de J. E. S. Cabral", Genre.POESIA, 180, 
            "A obra-prima do ultrarromantismo brasileiro. O livro divide-se em poesias de teor melancólico, amoroso e fúnebre, seguidas de poemas marcados pela ironia, pelo deboche urbano e pela desilusão amorosa juvenil."));

        booksToSeed.add(createBookHelper("O Seminarista", "Bernardo Guimarães", "9788508119074", 1872, "Typographia do Globo", Genre.ROMANCE, 160, 
            "Denúncia anticlerical sobre a tragédia de Eugênio, jovem obrigado a seguir a carreira do sacerdócio contra sua verdadeira vontade amorosa, o que resulta na loucura e na ruína de sua infância querida, Margarida."));

        booksToSeed.add(createBookHelper("A Escrava Isaura", "Bernardo Guimarães", "9788508129042", 1875, "Casa de J. Valerius", Genre.ROMANCE, 192, 
            "Romance abolicionista que conta a história da bela escrava branca Isaura, perseguida pelo cruel fazendeiro Leôncio. A obra gerou grande impacto social e foi adaptada com estrondoso sucesso mundial para a televisão."));

        booksToSeed.add(createBookHelper("Senhora", "José de Alencar", "9788508082728", 1875, "Typographia do Globo", Genre.ROMANCE, 288, 
            "A orgulhosa Aurélia Camargo herda uma imensa fortuna e decide 'comprar' como marido o jovem Fernando Seixas, que a havia abandonado anteriormente por interesse financeiro. Uma crítica ao casamento por conveniência na sociedade carioca."));

        booksToSeed.add(createBookHelper("Lucíola", "José de Alencar", "9788508139614", 1862, "Typographia de J. Valerius", Genre.ROMANCE, 192, 
            "O romance acompanha o drama de Lúcia (Maria da Glória), uma cortesã da alta sociedade carioca que busca purificação moral através do amor sincero pelo ingênuo Paulo. Uma exploração sensível da redenção feminina."));

        booksToSeed.add(createBookHelper("Cinco Minutos", "José de Alencar", "9788508119098", 1856, "Typographia do Correio Mercantil", Genre.ROMANCE, 128, 
            "Um jovem perde um ônibus por cinco minutos e acaba encontrando uma misteriosa mulher mascarada, desencadeando uma emocionante busca romântica que o leva a viajar pelo interior do Rio de Janeiro."));

        booksToSeed.add(createBookHelper("A Viuvinha", "José de Alencar", "9788508119104", 1857, "Typographia do Correio Mercantil", Genre.ROMANCE, 112, 
            "Narra a história do jovem Jorge, que simula sua própria morte após ir à falência para poupar sua noiva Carolina da vergonha da miséria, lutando nas sombras para recuperar sua honra e fortuna."));

        booksToSeed.add(createBookHelper("Helena", "Machado de Assis", "9788535914863", 1876, "Typographia de O Novo Mundo", Genre.ROMANCE, 200, 
            "Romance da fase romântica de Machado. O conselheiro Vale morre e revela em testamento a existência de uma filha bastarda, Helena, que passa a morar com seu meio-irmão Estácio, desenvolvendo uma paixão reprimida de trágico desfecho."));

        booksToSeed.add(createBookHelper("A Mão e a Luva", "Machado de Assis", "9788535914870", 1874, "Typographia de O Novo Mundo", Genre.ROMANCE, 160, 
            "Guiomara é uma moça humilde e ambiciosa que busca ascensão social e estabilidade. Ela é cortejada por três homens de temperamentos diferentes, escolhendo aquele que melhor se alinha às suas próprias ambições práticas."));

        booksToSeed.add(createBookHelper("Ressurreição", "Machado de Assis", "9788535914887", 1872, "Typographia da Gazeta de Noticias", Genre.ROMANCE, 180, 
            "O romance de estreia de Machado de Assis. Narra o namoro atormentado entre o cético e ciumento Félix e a bela viúva Lívia, explorando os dilemas morais e psicológicos que impedem a felicidade do casal."));

        booksToSeed.add(createBookHelper("Casa-Grande & Senzala", "Gilberto Freyre", "9788526010093", 1933, "José Olympio", Genre.HISTORIA, 560, 
            "Obra revolucionária da sociologia brasileira. O autor discute a formação da sociedade patriarcal no Brasil colonial a partir da miscigenação étnica e da convivência cultural entre europeus, indígenas e africanos escravizados."));

        booksToSeed.add(createBookHelper("Raízes do Brasil", "Sérgio Buarque de Holanda", "9788535920444", 1936, "José Olympio", Genre.HISTORIA, 240, 
            "Ensaio clássico sobre a identidade nacional. O autor discute o conceito de 'homem cordial' e as dificuldades de transição da cultura agrária, familiar e personalista herdada de Portugal para uma democracia moderna e burocrática."));

        booksToSeed.add(createBookHelper("Uma Breve História do Tempo", "Stephen Hawking", "9788501072923", 1988, "Bantam Books", Genre.CIENCIA, 256, 
            "Uma explicação acessível sobre a física moderna, as origens do universo, buracos negros, a teoria da relatividade geral e a busca por uma grande teoria unificada para explicar todas as forças físicas do cosmo."));

        for (Book book : booksToSeed) {
            if (!bookRepository.existsByIsbn(book.getIsbn())) {
                try {
                    bookRepository.saveAndFlush(book);
                    log.info("Book seeded: {} (ISBN: {})", book.getTitle(), book.getIsbn());
                } catch (Exception e) {
                    log.warn("Failed to seed book {} (ISBN: {}): {}", book.getTitle(), book.getIsbn(), e.getMessage());
                }
            }
        }
        log.info("Book seeding process completed.");
    }

    private Book createBookHelper(String title, String author, String isbn, int year, String publisher, Genre genre, int pageCount, String synopsis) {
        Book book = new Book();
        book.setTitle(title);
        book.setAuthor(author);
        book.setIsbn(isbn);
        book.setTotalCopies(1);
        book.setAvailableCopies(1);
        book.setPublicationYear(year);
        book.setPublisher(publisher);
        book.setGenre(genre);
        book.setPageCount(pageCount);
        book.setSynopsis(synopsis);
        return book;
    }

    private void seedLoans() {
        if (loanRepository.count() == 0) {
            List<User> users = userRepository.findAll();
            List<Book> books = bookRepository.findAll();

            if (users.size() < 9) {
                log.warn("Cannot seed loans: not enough users in database.");
                return;
            }

            User pedro = findUser(users, "pedro@gmail.com");
            User domjoao = findUser(users, "domjoao@gmail.com");
            User isabel = findUser(users, "isabel@gmail.com");
            User anita = findUser(users, "anita@gmail.com");
            User getulio = findUser(users, "getulio@gmail.com");
            User juscelino = findUser(users, "juscelino@gmail.com");
            User gabriel = findUser(users, "gabriel@gmail.com");

            LocalDate today = LocalDate.now();

            try {
                createLoanHelper(pedro, findBookByIsbn(books, "9788544001813"), today.minusDays(20), today.minusDays(6), null, LoanStatus.OVERDUE);
                createLoanHelper(pedro, findBookByIsbn(books, "9788520938447"), today.minusDays(5), today.plusDays(9), null, LoanStatus.ACTIVE);

                createLoanHelper(domjoao, findBookByIsbn(books, "9788575427583"), today.minusDays(30), today.minusDays(16), today.minusDays(10), LoanStatus.OVERDUE);
                createLoanHelper(domjoao, findBookByIsbn(books, "9788535914849"), today.minusDays(25), today.minusDays(11), today.minusDays(11), LoanStatus.RETURNED);

                createLoanHelper(isabel, findBookByIsbn(books, "9788508129035"), today.minusDays(10), today.plusDays(4), null, LoanStatus.ACTIVE);
                createLoanHelper(isabel, findBookByIsbn(books, "9788508082667"), today.minusDays(30), today.minusDays(16), null, LoanStatus.OVERDUE);

                createLoanHelper(anita, findBookByIsbn(books, "9788577990444"), today.minusDays(40), today.minusDays(26), null, LoanStatus.OVERDUE);
                createLoanHelper(anita, findBookByIsbn(books, "9788501115164"), today.minusDays(8), today.plusDays(6), null, LoanStatus.ACTIVE);

                createLoanHelper(getulio, findBookByIsbn(books, "9788535914061"), today.minusDays(50), today.minusDays(36), null, LoanStatus.OVERDUE);
                createLoanHelper(getulio, findBookByIsbn(books, "9788532508102"), today.minusDays(60), today.minusDays(46), today.minusDays(44), LoanStatus.OVERDUE);

                createLoanHelper(juscelino, findBookByIsbn(books, "9788520938454"), today.minusDays(4), today.plusDays(10), null, LoanStatus.ACTIVE);
                createLoanHelper(juscelino, findBookByIsbn(books, "9788535905557"), today.minusDays(15), today.minusDays(1), null, LoanStatus.OVERDUE);

                createLoanHelper(gabriel, findBookByIsbn(books, "9788501000675"), today.minusDays(12), today.plusDays(2), null, LoanStatus.ACTIVE);
                createLoanHelper(gabriel, findBookByIsbn(books, "9788532508140"), today.minusDays(3), today.plusDays(11), null, LoanStatus.ACTIVE);

                log.info("Spread of loans seeded successfully.");
            } catch (Exception e) {
                log.error("Failed to seed loans: ", e);
            }
        }
    }

    private void createLoanHelper(User user, Book book, LocalDate loanDate, LocalDate dueDate, LocalDate returnDate, LoanStatus status) {
        try {
            Loan loan = new Loan();
            loan.setUser(user);
            loan.setBook(book);
            loan.setLoanDate(loanDate);
            loan.setDueDate(dueDate);
            loan.setReturnDate(returnDate);
            loan.setStatus(status);
            loanRepository.saveAndFlush(loan);

            if (returnDate == null) {
                book.setAvailableCopies(Math.max(0, book.getAvailableCopies() - 1));
                bookRepository.saveAndFlush(book);
            }
        } catch (Exception ex) {
            log.warn("Could not seed loan for user {} and book {}: {}", user.getEmail(), book.getTitle(), ex.getMessage());
        }
    }

    private User findUser(List<User> users, String email) {
        return users.stream()
                .filter(u -> u.getEmail().equalsIgnoreCase(email))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Required user not found for loan seeding: " + email));
    }

    private Book findBookByIsbn(List<Book> books, String isbn) {
        return books.stream()
                .filter(b -> b.getIsbn().equals(isbn))
                .findFirst()
                .orElseGet(() -> bookRepository.findAll().stream()
                        .filter(b -> b.getIsbn().equals(isbn))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Required book not found for loan seeding: " + isbn)));
    }
}
