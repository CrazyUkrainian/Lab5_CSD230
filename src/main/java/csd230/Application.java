package csd230;

import com.github.javafaker.Faker;
import csd230.entities.Book;
import csd230.entities.Cart;
import csd230.repositories.BookRepository;
import csd230.repositories.CartItemRepository;
import csd230.repositories.CartRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@SpringBootApplication
public class Application {
	private static final Logger log = LoggerFactory.getLogger(Application.class);

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

    @Bean
    public WebMvcConfigurer corsConfigurer() {

        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry
                        .addMapping("/**")
                        .allowedMethods(CorsConfiguration.ALL)
                        .allowedHeaders(CorsConfiguration.ALL)
                        .allowedOriginPatterns(CorsConfiguration.ALL);
            }
        };
    }
	@Autowired
	CartItemRepository cartItemRepository;

	@Autowired
	CartRepository cartRepository;

	@Bean
	public CommandLineRunner demo(BookRepository repository) {
		return (args) -> {
            Cart cart = new Cart();
            cartRepository.save(cart);

            Faker faker = new Faker();
            com.github.javafaker.Book fakeBook = faker.book();
            com.github.javafaker.Number number = faker.number();
            com.github.javafaker.Code code = faker.code();

            // save a few customers
            String isbn;
            for (int i = 0; i < 2; i++) {
                String title = fakeBook.title();
                double price = number.randomDouble(2, 10, 100);
                int copies = number.numberBetween(5, 20);
                int quantity = number.numberBetween(1, 50);
                String author = fakeBook.author();
                isbn = code.isbn10();
                String description = "Book: " + title;
                //     public Book(double price, int quantity, String description, Cart cart, String title, int copies, String author, String ISBN_10) {
                Book book = new Book(
                        price,
                        quantity,
                        description,
                        title,
                        copies,
                        author,
                        isbn
                );

                cart.addItem(book);
                repository.save(book);
                cartRepository.save(cart);
            }


            // fetch all customers
            log.info("BookEntitys found with findAll():");
            log.info("-------------------------------");
            repository.findAll().forEach(book -> {
                log.info(book.toString());
            });
            log.info("");

            // fetch an individual customer by ID
            Book book = repository.findById(1L);
            log.info("BookEntity found with findById(1L):");
            log.info("--------------------------------");
            log.info(book.toString());
            log.info("");


            // fetch book by ISBN_10
            log.info("BookEntity found with findByIsbn('" + book.getIsbn() + "'):");
            log.info("--------------------------------------------");
            Book b = repository.findByIsbn(book.getIsbn());
            log.info("found by isbn: "+b.toString());

            log.info("");
            // fetch all items in cart
            log.info("CartItemEntitys found with findAll():");
            log.info("-------------------------------");
            cartRepository.findAll().forEach(carT -> {
                log.info(carT.toString());
                cartItemRepository.findAll().forEach(cartItem -> {
                    log.info("-------------------------------");
                    log.info(cartItem.toString());
                });
            });
            log.info("");

        };
	}
}
