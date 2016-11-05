import os
from tqdm import tqdm
import numpy as np
from spamfilter import parse, is_spam


def makedictionary(spam_directory, ham_directory, spam, ham):

    spam_prior_probability = len(spam)/float((len(spam) + len(ham)))

    words = {}
    for s in spam:
        for word in parse(open(os.path.join(spam_directory, s))):
            if word not in words:
                words[word] = {'spam': 1, 'ham': 0}
            else:
                words[word]['spam'] += 1
    for h in ham:
        for word in parse(open(os.path.join(ham_directory, h))):
            if word not in words:
                words[word] = {'spam': 0, 'ham': 1}
            else:
                words[word]['ham'] += 1

    for k, v in words.items():
        words[k]['spam'] = (float(v['spam']) + 1.0) / (float(len(spam)) + 1.0)
        words[k]['ham'] = (float(v['ham']) + 1.0) / (float(len(ham)) + 1.0)

    return words, spam_prior_probability


def shuffle(mails, spam, ham, fold):

    indice = range(len(mails))
    np.random.shuffle(indice)
    slice = len(mails) / fold if len(mails) / fold else 1
    for i in range(fold):
        test_index = indice[i*slice:(i+1)*slice]
        train_spam, train_ham, test_spam, test_ham = [], [], [], []
        for index, mail in enumerate(mails):
            if mail in spam:
                if index not in test_index:
                    train_spam.append(mail)
                else:
                    test_spam.append(mail)
            elif mail in ham:
                if index not in test_index:
                    train_ham.append(mail)
                else:
                    test_ham.append(mail)
            else:
                raise KeyError("{} is not known".format(mail))
        yield train_spam, train_ham, test_spam, test_ham


def experiment(spam_directory, ham_directory, fold):

    spam = [f for f in os.listdir(spam_directory) if os.path.isfile(os.path.join(spam_directory, f))]
    ham = [f for f in os.listdir(ham_directory) if os.path.isfile(os.path.join(ham_directory, f))]
    mails = spam + ham

    for train_spam, train_ham, test_spam, test_ham in shuffle(mails, spam, ham, fold):
        dictionary, spam_prior_probability = makedictionary(spam_directory, ham_directory, train_spam, train_ham)

        TP = 0
        TN = 0
        FP = 0
        FN = 0
        for s in tqdm(test_spam):
            content = [word for word in parse(open(os.path.join(spam_directory, s)))]
            result = is_spam(content, dictionary, spam_prior_probability)
            if result:
                TP += 1
            else:
                FN += 1
        for h in tqdm(test_ham):
            content = [word for word in parse(open(os.path.join(ham_directory, h)))]
            result = is_spam(content, dictionary, spam_prior_probability)
            if result:
                FP += 1
            else:
                TN += 1

        print "TP: {}\tTN: {}\nFP: {}\tFN: {}".format(TP, TN, FP, FN)

if __name__ == "__main__":

    spam_directory = "spam_2"
    ham_directory = "hard_ham"
    fold = 10

    experiment(spam_directory, ham_directory, fold)
